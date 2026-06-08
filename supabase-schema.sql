-- ============================================================
-- PRODE MUNDIAL 2026 — Schema completo para Supabase
-- Ejecutar en: supabase.com → tu proyecto → SQL Editor
-- ============================================================

-- 1. PERFILES DE USUARIO
-- (Supabase maneja auth en auth.users, acá guardamos datos extra)
create table public.perfiles (
  id uuid references auth.users(id) on delete cascade primary key,
  nombre text not null,
  email text not null,
  telefono text,
  es_admin boolean default false,
  created_at timestamptz default now()
);

alter table public.perfiles enable row level security;

create policy "Usuarios ven su propio perfil"
  on public.perfiles for select
  using (auth.uid() = id);

create policy "Admins ven todos los perfiles"
  on public.perfiles for select
  using (exists (select 1 from public.perfiles where id = auth.uid() and es_admin = true));

create policy "Usuarios actualizan su perfil"
  on public.perfiles for update
  using (auth.uid() = id);


-- 2. PARTIDOS
create table public.partidos (
  id serial primary key,
  fase text not null,           -- 'Grupos', 'R16', 'QF', 'SF', 'F'
  grupo text,                    -- 'A', 'B', ... solo en fase grupos
  equipo_local text not null,
  flag_local text not null,      -- emoji de bandera
  equipo_visitante text not null,
  flag_visitante text not null,
  fecha timestamptz not null,    -- fecha y hora real del partido
  estadio text,
  ciudad text,
  jugado boolean default false,
  resultado_local int,
  resultado_visitante int,
  created_at timestamptz default now()
);

alter table public.partidos enable row level security;

create policy "Todos pueden ver partidos"
  on public.partidos for select
  to authenticated
  using (true);

create policy "Solo admins cargan resultados"
  on public.partidos for update
  using (exists (select 1 from public.perfiles where id = auth.uid() and es_admin = true));


-- 3. PRONÓSTICOS
create table public.pronosticos (
  id serial primary key,
  user_id uuid references auth.users(id) on delete cascade,
  partido_id int references public.partidos(id) on delete cascade,
  goles_local int not null,
  goles_visitante int not null,
  puntos_obtenidos int default 0,  -- se actualiza cuando el partido termina
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, partido_id)
);

alter table public.pronosticos enable row level security;

create policy "Usuarios ven sus pronósticos"
  on public.pronosticos for select
  using (auth.uid() = user_id);

create policy "Usuarios cargan sus pronósticos"
  on public.pronosticos for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.partidos p
      where p.id = partido_id
      and p.jugado = false
      and p.fecha > now() + interval '1 hour'
    )
  );

create policy "Usuarios modifican sus pronósticos (solo si no cerró)"
  on public.pronosticos for update
  using (
    auth.uid() = user_id
    and exists (
      select 1 from public.partidos p
      where p.id = partido_id
      and p.jugado = false
      and p.fecha > now() + interval '1 hour'
    )
  );


-- 4. GANADORES SEMANALES
create table public.ganadores_semanales (
  id serial primary key,
  semana int not null,
  fecha_inicio date not null,
  fecha_fin date not null,
  user_id uuid references auth.users(id),
  nombre_ganador text,
  puntos_semana int,
  exactos_semana int,
  diferencia_semana int,
  created_at timestamptz default now()
);

alter table public.ganadores_semanales enable row level security;

create policy "Todos ven ganadores semanales"
  on public.ganadores_semanales for select
  to authenticated
  using (true);


-- ============================================================
-- 5. VISTA: TABLA DE POSICIONES
-- Calcula automáticamente puntos, exactos y diferencia
-- ============================================================
create or replace view public.tabla_posiciones as
select
  p.id as user_id,
  p.nombre,
  count(case when pr.puntos_obtenidos = 3 then 1 end) as exactos,
  count(case when pr.puntos_obtenidos = 1 then 1 end) as ganadores,
  coalesce(sum(pr.puntos_obtenidos), 0) as puntos,
  coalesce(sum(
    abs(pr.goles_local - pa.resultado_local) +
    abs(pr.goles_visitante - pa.resultado_visitante)
  ) filter (where pa.jugado = true), 0) as diferencia_total
from public.perfiles p
left join public.pronosticos pr on pr.user_id = p.id
left join public.partidos pa on pa.id = pr.partido_id
group by p.id, p.nombre;


-- ============================================================
-- 6. FUNCIÓN: Calcular puntos al cargar resultado
-- Se llama desde un trigger cuando se actualiza un partido
-- ============================================================
create or replace function public.calcular_puntos_partido()
returns trigger language plpgsql as $$
begin
  if NEW.jugado = true and NEW.resultado_local is not null then
    update public.pronosticos
    set puntos_obtenidos = case
      -- Resultado exacto: 3 puntos
      when goles_local = NEW.resultado_local
       and goles_visitante = NEW.resultado_visitante
      then 3
      -- Ganador correcto: 1 punto
      when (goles_local > goles_visitante and NEW.resultado_local > NEW.resultado_visitante)
        or (goles_local < goles_visitante and NEW.resultado_local < NEW.resultado_visitante)
        or (goles_local = goles_visitante and NEW.resultado_local = NEW.resultado_visitante)
      then 1
      else 0
    end,
    updated_at = now()
    where partido_id = NEW.id;
  end if;
  return NEW;
end;
$$;

create trigger trg_calcular_puntos
  after update on public.partidos
  for each row
  when (NEW.jugado = true and OLD.jugado = false)
  execute function public.calcular_puntos_partido();


-- ============================================================
-- 7. FUNCIÓN: Calcular ganador semanal (ejecutar cada domingo)
-- ============================================================
create or replace function public.calcular_ganador_semanal(
  p_semana int,
  p_fecha_inicio date,
  p_fecha_fin date
)
returns void language plpgsql as $$
declare
  v_ganador record;
begin
  select
    pr.user_id,
    p.nombre,
    sum(pr.puntos_obtenidos) as puntos,
    count(case when pr.puntos_obtenidos = 3 then 1 end) as exactos,
    sum(
      abs(pr.goles_local - pa.resultado_local) +
      abs(pr.goles_visitante - pa.resultado_visitante)
    ) filter (where pa.jugado = true) as diferencia
  from public.pronosticos pr
  join public.partidos pa on pa.id = pr.partido_id
  join public.perfiles p on p.id = pr.user_id
  where pa.fecha::date between p_fecha_inicio and p_fecha_fin
    and pa.jugado = true
  group by pr.user_id, p.nombre
  order by puntos desc, exactos desc, diferencia asc
  limit 1
  into v_ganador;

  if v_ganador.user_id is not null then
    insert into public.ganadores_semanales
      (semana, fecha_inicio, fecha_fin, user_id, nombre_ganador, puntos_semana, exactos_semana, diferencia_semana)
    values
      (p_semana, p_fecha_inicio, p_fecha_fin, v_ganador.user_id, v_ganador.nombre, v_ganador.puntos, v_ganador.exactos, v_ganador.diferencia)
    on conflict do nothing;
  end if;
end;
$$;

-- ============================================================
-- EJEMPLO DE USO (ejecutar manualmente cada domingo):
-- select public.calcular_ganador_semanal(1, '2026-06-11', '2026-06-17');
-- select public.calcular_ganador_semanal(2, '2026-06-18', '2026-06-24');
-- ============================================================
