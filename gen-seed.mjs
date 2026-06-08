import { PARTIDOS_GRUPOS, PARTIDOS_ELIMINATORIOS } from './src/lib/fixture.js'

const todos = [...PARTIDOS_GRUPOS, ...PARTIDOS_ELIMINATORIOS]

function esc(v) {
  if (v === undefined || v === null) return 'null'
  return `'${String(v).replace(/'/g, "''")}'`
}

const rows = todos.map((p) => {
  const flagL = p.flagLocal ?? ''
  const flagV = p.flagVisitante ?? ''
  return `  (${p.id}, ${esc(p.fase)}, ${esc(p.grupo)}, ${esc(p.local)}, ${esc(flagL)}, ${esc(p.visitante)}, ${esc(flagV)}, ${esc(p.fecha)}, ${esc(p.estadio)}, ${esc(p.ciudad)})`
}).join(',\n')

const sql = `-- ============================================================
-- SEED: Partidos del Mundial 2026 (generado desde src/lib/fixture.js)
-- Fixture REAL de fase de grupos. Horarios en hora de Argentina (-03:00).
-- Ejecutar en: Supabase -> SQL Editor (DESPUES del schema principal)
-- Idempotente: se puede correr varias veces sin duplicar.
-- ============================================================

insert into public.partidos
  (id, fase, grupo, equipo_local, flag_local, equipo_visitante, flag_visitante, fecha, estadio, ciudad)
values
${rows}
on conflict (id) do update set
  fase = excluded.fase,
  grupo = excluded.grupo,
  equipo_local = excluded.equipo_local,
  flag_local = excluded.flag_local,
  equipo_visitante = excluded.equipo_visitante,
  flag_visitante = excluded.flag_visitante,
  fecha = excluded.fecha,
  estadio = excluded.estadio,
  ciudad = excluded.ciudad;

-- Reajustar la secuencia del serial
select setval(pg_get_serial_sequence('public.partidos', 'id'), (select max(id) from public.partidos));
`

process.stdout.write(sql)
