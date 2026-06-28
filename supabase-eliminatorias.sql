-- ============================================================
-- ELIMINATORIAS AUTOMATICAS — Mundial 2026
-- Ya aplicado en la base. Documenta como esta armado.
--
-- Las eliminatorias (R32/R16/QF/SF/3er/F) NO estan en src/lib/fixture.js:
-- viven en la tabla public.partidos y se cargan/actualizan solas desde
-- football-data.org. El front (Fixture.jsx / Admin.jsx) las lee de la base.
--
-- Flujo:
--   1. sync_eliminatorias() (cron cada 15 min) crea los partidos de
--      eliminatorias por external_id y completa los equipos a medida que
--      el proveedor define los cruces (mejores terceros, etc.), traduciendo
--      el nombre ingles -> espanol con la tabla public.equipos_es.
--      Mientras un equipo no esta definido queda como 'A definir'.
--   2. sync_mundial() (cron cada 10 min) carga los RESULTADOS por external_id
--      (sirve para grupos y eliminatorias por igual).
--   3. El trigger trg_calcular_puntos reparte los puntos.
-- ============================================================

-- Tabla de traduccion de nombres (ingles de la API -> espanol del front)
create table if not exists public.equipos_es (en text primary key, es text not null);
-- (poblada con los 48 equipos; ej: 'Germany'->'Alemania', 'United States'->'EE.UU.')

-- Funcion: crea/actualiza los partidos de eliminatorias desde la API
create or replace function public.sync_eliminatorias()
returns int
language plpgsql
security definer
set search_path = public, extensions
as $fn$
declare
  v_key text; v_resp extensions.http_response; v_m jsonb; v_n int := 0;
  v_intento int; v_fase text; v_home text; v_away text; v_ext text; v_fecha timestamptz;
begin
  select value into v_key from private.secrets where name='footballdata_key';
  if v_key is null then return 0; end if;

  perform extensions.http_set_curlopt('CURLOPT_CONNECTTIMEOUT_MS','10000');
  perform extensions.http_set_curlopt('CURLOPT_TIMEOUT_MS','20000');

  for v_intento in 1..3 loop
    begin
      select * into v_resp from extensions.http((
        'GET','https://api.football-data.org/v4/competitions/2000/matches',
        array[extensions.http_header('X-Auth-Token', v_key)], null, null
      )::extensions.http_request);
      exit;
    exception when others then
      if v_intento = 3 then raise; end if; perform pg_sleep(2);
    end;
  end loop;
  if v_resp.status <> 200 then return 0; end if;

  for v_m in select value from jsonb_array_elements((v_resp.content::jsonb) -> 'matches')
  loop
    v_fase := case v_m->>'stage'
                when 'LAST_32' then 'R32' when 'LAST_16' then 'R16'
                when 'QUARTER_FINALS' then 'QF' when 'SEMI_FINALS' then 'SF'
                when 'THIRD_PLACE' then '3er' when 'FINAL' then 'F' else null end;
    if v_fase is null then continue; end if; -- ignora solo la fase de grupos

    v_ext := v_m->>'id';
    v_fecha := (v_m->>'utcDate')::timestamptz;
    select es into v_home from public.equipos_es where en = (v_m #>> '{homeTeam,name}');
    if v_home is null then v_home := (v_m #>> '{homeTeam,name}'); end if;
    select es into v_away from public.equipos_es where en = (v_m #>> '{awayTeam,name}');
    if v_away is null then v_away := (v_m #>> '{awayTeam,name}'); end if;

    if exists (select 1 from public.partidos where external_id = v_ext) then
      update public.partidos
        set equipo_local = coalesce(v_home, equipo_local),
            equipo_visitante = coalesce(v_away, equipo_visitante),
            fecha = v_fecha
      where external_id = v_ext;
    else
      insert into public.partidos (fase, equipo_local, equipo_visitante, flag_local, flag_visitante, fecha, external_id, jugado)
      values (v_fase, coalesce(v_home,'A definir'), coalesce(v_away,'A definir'), '', '', v_fecha, v_ext, false);
    end if;
    v_n := v_n + 1;
  end loop;
  return v_n;
end;
$fn$;

-- Programar cada 15 minutos
do $$ begin
  if exists (select 1 from cron.job where jobname='sync-eliminatorias') then
    perform cron.unschedule('sync-eliminatorias');
  end if;
end $$;
select cron.schedule('sync-eliminatorias','*/15 * * * *', $$select public.sync_eliminatorias();$$);

-- Util: forzar a mano -> select public.sync_eliminatorias();
