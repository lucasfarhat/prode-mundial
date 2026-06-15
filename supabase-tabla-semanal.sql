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

-- Ganadores semanales: se cargan a mano cada semana (un INSERT por semana).
-- Ejemplo semana 1 (11 al 14 jun, ganador Tomas Werenitzky):
--   insert into public.ganadores_semanales
--     (semana, fecha_inicio, fecha_fin, user_id, nombre_ganador,
--      puntos_semana, exactos_semana, diferencia_semana)
--   values
--     (1, '2026-06-11', '2026-06-14', '<uuid>', 'Tomas Werenitzky', 11, 2, 24);
--
-- Para sacar el ranking de una semana y elegir el ganador:
--   select p.nombre,
--     coalesce(sum(pr.puntos_obtenidos),0) as pts,
--     count(*) filter (where pr.puntos_obtenidos=3) as exactos,
--     coalesce(sum(abs(pr.goles_local-pa.resultado_local)+abs(pr.goles_visitante-pa.resultado_visitante)) filter (where pa.jugado),0) as dif
--   from perfiles p
--   left join partidos pa on pa.jugado=true
--     and (pa.fecha at time zone 'America/Argentina/Buenos_Aires') between '<lunes 00:00>' and '<domingo 23:59>'
--   left join pronosticos pr on pr.partido_id=pa.id and pr.user_id=p.id
--   group by p.nombre order by pts desc, exactos desc, dif asc;
