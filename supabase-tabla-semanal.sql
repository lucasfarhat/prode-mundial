-- ============================================================
-- TABLA DE LA SEMANA EN CURSO + GANADORES SEMANALES
-- Ya aplicado en la base. Este archivo documenta como esta armado.
-- ============================================================

-- Vista: posiciones contando SOLO los partidos de la semana en curso
-- (lunes 00:00 a domingo 23:59, hora Argentina). Avanza sola cada lunes.
create or replace view public.tabla_semana_actual as
with semana as (
  select date_trunc('week', (now() at time zone 'America/Argentina/Buenos_Aires')) as inicio
)
select
  p.id as user_id,
  p.nombre,
  count(case when pr.puntos_obtenidos = 3 then 1 end)::int as exactos,
  count(case when pr.puntos_obtenidos = 1 then 1 end)::int as ganadores,
  coalesce(sum(pr.puntos_obtenidos), 0)::int as puntos,
  coalesce(sum(
    abs(pr.goles_local - pa.resultado_local) + abs(pr.goles_visitante - pa.resultado_visitante)
  ) filter (where pa.jugado), 0)::int as diferencia_total
from public.perfiles p
cross join semana s
left join public.partidos pa
  on pa.jugado = true
  and (pa.fecha at time zone 'America/Argentina/Buenos_Aires') >= s.inicio
  and (pa.fecha at time zone 'America/Argentina/Buenos_Aires') <  s.inicio + interval '7 days'
left join public.pronosticos pr
  on pr.partido_id = pa.id and pr.user_id = p.id
group by p.id, p.nombre;

grant select on public.tabla_semana_actual to anon, authenticated;

-- ============================================================
-- GANADOR SEMANAL AUTOMATICO
-- Semanas 1 y 2 se cargaron a mano. De la 3 en adelante las carga
-- sola la funcion cerrar_semanas() via pg_cron (diario 12:00 ART).
--
-- Numeracion de semanas: lunes-domingo (ART). El lunes de la "semana 1"
-- es date_trunc('week', '2026-06-11') = 2026-06-08, y de ahi en adelante
-- semana = ((lunes - 2026-06-08) / 7) + 1.
--   semana 1: 08-14 jun (arranco el 11)   semana 2: 15-21   semana 3: 22-28 ...
--
-- Una semana se "cierra" cuando TODOS sus partidos estan jugados Y ya paso
-- su domingo. La funcion es idempotente: saltea las semanas que ya tienen
-- ganador y no toca la semana en curso.
-- ============================================================

create or replace function public.cerrar_semanas()
returns int
language plpgsql
security definer
set search_path = public
as $fn$
declare
  v_anchor date := date_trunc('week', date '2026-06-11')::date; -- lunes semana 1
  v_now_art date := (now() at time zone 'America/Argentina/Buenos_Aires')::date;
  v_inserted int := 0;
  w record;
  v_win record;
  v_semana int;
begin
  for w in
    select x.lunes
    from (
      select date_trunc('week', (pa.fecha at time zone 'America/Argentina/Buenos_Aires'))::date as lunes,
             bool_and(pa.jugado) as todos_jugados
      from public.partidos pa
      group by 1
    ) x
    where x.todos_jugados = true
      and x.lunes + 7 <= v_now_art
  loop
    v_semana := ((w.lunes - v_anchor) / 7) + 1;
    if exists (select 1 from public.ganadores_semanales where semana = v_semana) then
      continue;
    end if;

    select p.id as user_id, p.nombre,
      coalesce(sum(pr.puntos_obtenidos),0)::int as puntos,
      count(case when pr.puntos_obtenidos=3 then 1 end)::int as exactos,
      count(case when pr.puntos_obtenidos=1 then 1 end)::int as ganadores,
      coalesce(sum(abs(pr.goles_local-pa.resultado_local)+abs(pr.goles_visitante-pa.resultado_visitante)) filter (where pa.jugado),0)::int as diferencia
    into v_win
    from public.perfiles p
    left join public.partidos pa on pa.jugado = true
      and date_trunc('week', (pa.fecha at time zone 'America/Argentina/Buenos_Aires'))::date = w.lunes
    left join public.pronosticos pr on pr.partido_id = pa.id and pr.user_id = p.id
    group by p.id, p.nombre
    having coalesce(sum(pr.puntos_obtenidos),0) > 0
    order by puntos desc, exactos desc, diferencia asc
    limit 1;

    if v_win.user_id is not null then
      insert into public.ganadores_semanales
        (semana, fecha_inicio, fecha_fin, user_id, nombre_ganador, puntos_semana, exactos_semana, diferencia_semana)
      values
        (v_semana, w.lunes, w.lunes + 6, v_win.user_id, v_win.nombre, v_win.puntos, v_win.exactos, v_win.diferencia);
      v_inserted := v_inserted + 1;
    end if;
  end loop;

  return v_inserted;
end;
$fn$;

-- Programar diario 15:00 UTC = 12:00 ART
do $$ begin
  if exists (select 1 from cron.job where jobname = 'cerrar-semanas') then
    perform cron.unschedule('cerrar-semanas');
  end if;
end $$;
select cron.schedule('cerrar-semanas', '0 15 * * *', $$select public.cerrar_semanas();$$);

-- Util: forzar el calculo a mano -> select public.cerrar_semanas();
