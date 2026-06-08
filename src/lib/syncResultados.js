// ============================================================
// src/lib/syncResultados.js
//
// Servicio de sincronización automática de resultados
// Usa football-data.org (plan gratuito: 10 req/min)
// o API-Football (100 req/día)
//
// ESTRATEGIA DE CACHE:
// - Los resultados se guardan en Supabase después de fetchearlos
// - Solo consultamos la API cuando hay partidos recientes sin resultado
// - Durante días sin partidos: 0 llamadas a la API
// ============================================================

import { supabase } from './supabase'

// ── Elegí tu proveedor ──────────────────────────────────────
const PROVIDER = 'football-data' // 'football-data' | 'api-football' | 'worldcup2026'

const CONFIG = {
  'football-data': {
    baseUrl: 'https://api.football-data.org/v4',
    headers: { 'X-Auth-Token': import.meta.env.VITE_FOOTBALLDATA_API_KEY },
    worldCupId: 2000,   // ID del Mundial en football-data.org
    season: 2026,
  },
  'api-football': {
    baseUrl: 'https://v3.football.api-sports.io',
    headers: {
      'x-apisports-key': import.meta.env.VITE_APIFOOTBALL_API_KEY,
    },
    worldCupId: 1,
    season: 2026,
  },
  'worldcup2026': {
    // API open source, sin key, hecha específicamente para el Mundial 2026
    // Proyecto: https://github.com/rezarahiminia/worldcup2026
    baseUrl: 'https://worldcup2026.p.rapidapi.com', // o el endpoint público cuando esté disponible
    headers: {},
    worldCupId: null,
    season: 2026,
  },
}

const cfg = CONFIG[PROVIDER]

// ── Cache local en memoria (evita llamadas repetidas en la misma sesión) ──
const memCache = {}
const CACHE_TTL_MS = 2 * 60 * 1000 // 2 minutos

function fromCache(key) {
  const entry = memCache[key]
  if (!entry) return null
  if (Date.now() - entry.ts > CACHE_TTL_MS) return null
  return entry.data
}
function toCache(key, data) {
  memCache[key] = { data, ts: Date.now() }
}

// ── Fetch genérico con retry ──────────────────────────────────
async function apiFetch(path) {
  const cached = fromCache(path)
  if (cached) return cached

  const res = await fetch(`${cfg.baseUrl}${path}`, { headers: cfg.headers })
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`)
  const data = await res.json()
  toCache(path, data)
  return data
}

// ── Adaptadores por proveedor ────────────────────────────────

async function fetchPartidosFootballData() {
  // Trae todos los partidos del Mundial 2026
  const data = await apiFetch(`/competitions/${cfg.worldCupId}/matches?season=${cfg.season}`)
  return data.matches.map((m) => ({
    externalId: String(m.id),
    equipoLocal: m.homeTeam.name,
    equipoVisitante: m.awayTeam.name,
    fecha: m.utcDate,
    estado: m.status,              // SCHEDULED | IN_PLAY | PAUSED | FINISHED | POSTPONED
    golesLocal: m.score?.fullTime?.home ?? null,
    golesVisitante: m.score?.fullTime?.away ?? null,
    fase: mapFaseFootballData(m.stage),
    grupo: m.group ?? null,
  }))
}

function mapFaseFootballData(stage) {
  const map = {
    GROUP_STAGE: 'Grupos',
    LAST_32: 'R32',
    LAST_16: 'R16',
    QUARTER_FINALS: 'QF',
    SEMI_FINALS: 'SF',
    THIRD_PLACE: '3er',
    FINAL: 'F',
  }
  return map[stage] || stage
}

async function fetchPartidosApiFootball() {
  const data = await apiFetch(`/fixtures?league=${cfg.worldCupId}&season=${cfg.season}`)
  return data.response.map((m) => ({
    externalId: String(m.fixture.id),
    equipoLocal: m.teams.home.name,
    equipoVisitante: m.teams.away.name,
    fecha: new Date(m.fixture.timestamp * 1000).toISOString(),
    estado: m.fixture.status.short,  // NS | 1H | HT | 2H | FT | AET | PEN
    golesLocal: m.goals.home,
    golesVisitante: m.goals.away,
    fase: mapFaseApiFootball(m.league.round),
    grupo: m.league.round?.includes('Group') ? m.league.round.split(' ').pop() : null,
  }))
}

function mapFaseApiFootball(round) {
  if (!round) return 'Grupos'
  if (round.includes('Group')) return 'Grupos'
  if (round.includes('32')) return 'R32'
  if (round.includes('16')) return 'R16'
  if (round.includes('Quarter')) return 'QF'
  if (round.includes('Semi')) return 'SF'
  if (round.includes('3rd') || round.includes('Third')) return '3er'
  if (round.includes('Final')) return 'F'
  return 'Grupos'
}

// ── Fetch según proveedor elegido ────────────────────────────
async function fetchPartidos() {
  if (PROVIDER === 'football-data') return fetchPartidosFootballData()
  if (PROVIDER === 'api-football') return fetchPartidosApiFootball()
  throw new Error('Proveedor no implementado: ' + PROVIDER)
}

// ── Sincronización con Supabase ──────────────────────────────

/**
 * Sincroniza resultados de partidos ya terminados.
 * Solo llama a la API externa si hay partidos recientes sin resultado.
 * Devuelve la cantidad de partidos actualizados.
 */
export async function sincronizarResultados() {
  // 1. Ver qué partidos deberían tener resultado ya (terminados hace >90 min)
  const ahora = new Date()
  const hace2h = new Date(ahora.getTime() - 2 * 60 * 60 * 1000).toISOString()

  const { data: pendientes, error } = await supabase
    .from('partidos')
    .select('id, external_id, fecha')
    .eq('jugado', false)
    .lt('fecha', hace2h)

  if (error) throw error
  if (!pendientes?.length) return 0  // Nada que actualizar, no llamamos a la API

  // 2. Traer datos frescos de la API
  const partidos = await fetchPartidos()

  // 3. Cruzar y actualizar los que terminaron
  let actualizados = 0
  const updates = []

  for (const pendiente of pendientes) {
    const match = partidos.find(
      (p) =>
        p.externalId === pendiente.external_id &&
        (p.estado === 'FINISHED' || p.estado === 'FT' || p.estado === 'AET' || p.estado === 'PEN') &&
        p.golesLocal !== null &&
        p.golesVisitante !== null
    )
    if (match) {
      updates.push({
        id: pendiente.id,
        resultado_local: match.golesLocal,
        resultado_visitante: match.golesVisitante,
        jugado: true,
      })
    }
  }

  if (updates.length > 0) {
    // Actualizar en Supabase (el trigger calcula los puntos automáticamente)
    for (const upd of updates) {
      await supabase
        .from('partidos')
        .update({
          resultado_local: upd.resultado_local,
          resultado_visitante: upd.resultado_visitante,
          jugado: true,
        })
        .eq('id', upd.id)
      actualizados++
    }
  }

  return actualizados
}

/**
 * Trae los partidos en vivo o recientes (últimas 4 horas)
 * para mostrar resultados parciales en tiempo real.
 * Se llama desde el componente Fixture cuando hay un partido en curso.
 */
export async function getPartidosEnVivo() {
  const partidos = await fetchPartidos()
  const ahora = new Date()
  const hace4h = new Date(ahora.getTime() - 4 * 60 * 60 * 1000)
  const en1h = new Date(ahora.getTime() + 60 * 60 * 1000)

  return partidos.filter((p) => {
    const fecha = new Date(p.fecha)
    return fecha > hace4h && fecha < en1h
  })
}

/**
 * Carga los external_ids en la tabla partidos de Supabase.
 * Ejecutar UNA SOLA VEZ después de hacer el deploy.
 * Cruza por nombre de equipo (aproximado).
 */
export async function cargarExternalIds() {
  const apiPartidos = await fetchPartidos()
  const { data: dbPartidos } = await supabase.from('partidos').select('id, equipo_local, equipo_visitante')

  let ok = 0
  for (const db of dbPartidos) {
    const match = apiPartidos.find(
      (p) =>
        normalizar(p.equipoLocal).includes(normalizar(db.equipo_local)) ||
        normalizar(db.equipo_local).includes(normalizar(p.equipoLocal))
    )
    if (match) {
      await supabase.from('partidos').update({ external_id: match.externalId }).eq('id', db.id)
      ok++
    }
  }
  return ok
}

function normalizar(str) {
  return (str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()
}
