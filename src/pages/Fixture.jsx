import { useState, useEffect } from 'react'
import { supabase, guardarPronostico, getPronosticosUsuario } from '../lib/supabase'
import { PARTIDOS_GRUPOS, PARTIDOS_ELIMINATORIOS } from '../lib/fixture'
import Flag from '../components/Flag'

const FASES = [
  { id: 'Grupos', label: 'Grupos' },
  { id: 'R32', label: '16avos' },
  { id: 'R16', label: 'Octavos' },
  { id: 'QF', label: 'Cuartos' },
  { id: 'SF', label: 'Semis' },
  { id: 'F', label: 'Final' },
]

function isLocked(fechaStr) {
  const fecha = new Date(fechaStr)
  const ahora = new Date()
  return ahora >= new Date(fecha.getTime() - 1 * 60 * 1000)
}

function formatFecha(fechaStr) {
  const d = new Date(fechaStr)
  const fecha = d.toLocaleDateString('es-AR', {
    day: 'numeric', month: 'short', timeZone: 'America/Argentina/Buenos_Aires',
  })
  const hora = d.toLocaleTimeString('es-AR', {
    hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Argentina/Buenos_Aires',
  })
  return `${fecha} · ${hora} hs`
}

export default function Fixture({ session }) {
  const [fase, setFase] = useState('Grupos')
  const [fechaActual, setFechaActual] = useState(null)
  const [pronosticos, setPronosticos] = useState({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [dbPartidos, setDbPartidos] = useState([])

  // Grupos: del fixture estatico. Eliminatorias: de la base (se completan
  // solas a medida que el proveedor define los cruces).
  const eliminatoriasDB = dbPartidos
    .filter((p) => p.fase !== 'Grupos')
    .map((p) => ({
      id: p.id,
      fase: p.fase,
      local: p.equipo_local,
      visitante: p.equipo_visitante,
      flagLocal: p.flag_local,
      flagVisitante: p.flag_visitante,
      fecha: p.fecha,
    }))
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
  const todosLosPartidos = [...PARTIDOS_GRUPOS, ...PARTIDOS_ELIMINATORIOS, ...eliminatoriasDB]

  useEffect(() => {
    if (session?.user) {
      getPronosticosUsuario(session.user.id).then((data) => {
        const map = {}
        data.forEach((p) => {
          map[p.partido_id] = { h: p.goles_local, a: p.goles_visitante, pts: p.puntos_obtenidos }
        })
        setPronosticos(map)
      })
    }
    // Intentar cargar partidos de Supabase (si ya están cargados por admin)
    supabase.from('partidos').select('*').then(({ data }) => {
      if (data?.length) setDbPartidos(data)
    })
  }, [session])

  function handleScore(partidoId, side, val) {
    const num = val === '' ? '' : Math.max(0, Math.min(20, parseInt(val) || 0))
    setPronosticos((prev) => ({
      ...prev,
      [partidoId]: { ...prev[partidoId], [side]: num },
    }))
  }

  async function handleSave() {
    if (!session) {
      alert('Necesitás iniciar sesión para guardar pronósticos')
      return
    }
    setSaving(true)
    try {
      const promises = Object.entries(pronosticos).map(([partidoId, val]) => {
        if (val.h === '' || val.h === undefined || val.a === '' || val.a === undefined) return null
        return guardarPronostico({
          userId: session.user.id,
          partidoId: parseInt(partidoId),
          golesLocal: val.h,
          golesVisitante: val.a,
        })
      }).filter(Boolean)
      await Promise.all(promises)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      alert('Error al guardar: ' + err.message)
    }
    setSaving(false)
  }

  const partidosDeFase = todosLosPartidos.filter((p) => p.fase === fase)

  // Calcular jornadas de grupos: cada grupo tiene 6 partidos en 3 jornadas (2 por jornada)
  const calcularJornada = (partido) => {
    if (fase !== 'Grupos') return null
    const partidosDelGrupo = partidosDeFase
      .filter(p => p.grupo === partido.grupo)
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
    const idx = partidosDelGrupo.findIndex(p => p.id === partido.id)
    return Math.floor(idx / 2) + 1 // jornada 1, 2 o 3
  }

  // Mapear partidos con su jornada
  const partidosConJornada = fase === 'Grupos'
    ? partidosDeFase.map(p => ({ ...p, jornada: calcularJornada(p) }))
    : partidosDeFase

  // Extraer jornadas únicas para Grupos
  const jornadas = fase === 'Grupos'
    ? [...new Set(partidosConJornada.map(p => p.jornada))].sort((a, b) => a - b)
    : [1]

  // Auto-detectar la primera jornada cuando cambia de fase
  useEffect(() => {
    if (jornadas.length && !fechaActual) {
      setFechaActual(jornadas[0])
    }
  }, [fase])

  // Auto-avanzar a la siguiente jornada cuando la actual termina
  useEffect(() => {
    if (!fechaActual || jornadas.length === 0) return
    const partidosDeJornada = partidosConJornada.filter(p => p.jornada === fechaActual)
    const todosTerminaron = partidosDeJornada.every(p => {
      const real = dbPartidos.find(r => r.id === p.id)
      return real?.jugado
    })
    if (todosTerminaron && jornadas.indexOf(fechaActual) < jornadas.length - 1) {
      const proximaJornadaIdx = jornadas.indexOf(fechaActual) + 1
      setFechaActual(jornadas[proximaJornadaIdx])
    }
  }, [dbPartidos, fechaActual, jornadas, partidosConJornada])

  // Filtrar partidos de la jornada actual y agrupar por grupo
  const partidosDeJornada = partidosConJornada.filter(p => p.jornada === fechaActual)
  const gruposDeJornada = {}
  if (fase === 'Grupos') {
    partidosDeJornada.forEach((p) => {
      if (!gruposDeJornada[p.grupo]) gruposDeJornada[p.grupo] = []
      gruposDeJornada[p.grupo].push(p)
    })
  }
  const partidos = fase === 'Grupos' ? partidosDeJornada : partidosDeFase

  function getResultadoReal(id) {
    return dbPartidos.find((p) => p.id === id)
  }

  function renderMatch(partido) {
    const locked = isLocked(partido.fecha)
    const pron = pronosticos[partido.id] || {}
    const real = getResultadoReal(partido.id)
    const jugado = real?.jugado

    return (
      <div className="match-row" key={partido.id}>
        <div className="team">
          <Flag name={partido.local} emoji={partido.flagLocal} />
          <span className="team-name">{partido.local}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div className="score-inputs">
            <input
              className="score-input"
              type="number"
              min="0" max="20"
              placeholder="-"
              value={pron.h ?? ''}
              onChange={(e) => handleScore(partido.id, 'h', e.target.value)}
              disabled={locked}
            />
            <span className="score-sep">:</span>
            <input
              className="score-input"
              type="number"
              min="0" max="20"
              placeholder="-"
              value={pron.a ?? ''}
              onChange={(e) => handleScore(partido.id, 'a', e.target.value)}
              disabled={locked}
            />
          </div>
          <span className="match-meta">{formatFecha(partido.fecha)}</span>
          {jugado && (
            <span className="match-meta" style={{ color: '#555', fontWeight: 600 }}>
              {real.resultado_local} - {real.resultado_visitante}
              {pron.pts === 3 && <span className="match-pts pts-exact"> ✓ 3pts</span>}
              {pron.pts === 1 && <span className="match-pts pts-winner"> ✓ 1pt</span>}
            </span>
          )}
          {locked && !jugado && (
            <span className="match-meta" style={{ color: '#e07000' }}>🔒 Cerrado</span>
          )}
        </div>

        <div className="team right">
          <Flag name={partido.visitante} emoji={partido.flagVisitante} />
          <span className="team-name">{partido.visitante}</span>
        </div>
      </div>
    )
  }

  return (
    <div>
      {!session && (
        <div className="alert alert-warning">
          ⚠️ Iniciá sesión para guardar tus pronósticos.
        </div>
      )}
      <div className="alert alert-info">
        🔒 Los pronósticos se cierran 1 minuto antes de cada partido.
      </div>

      <div className="phase-tabs">
        {FASES.map((f) => (
          <button
            key={f.id}
            className={`tab-btn ${fase === f.id ? 'active' : ''}`}
            onClick={() => { setFase(f.id); setFechaActual(null) }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {fase === 'Grupos' && jornadas.length > 0 && (
        <div style={{ display: 'flex', gap: 6, marginBottom: '1rem', overflowX: 'auto', paddingBottom: 4 }}>
          {jornadas.map((j) => {
            const label = 'Fecha ' + j
            return (
              <button
                key={j}
                onClick={() => setFechaActual(j)}
                style={{
                  padding: '7px 14px',
                  border: j === fechaActual ? 'none' : '1px solid #ddd',
                  borderRadius: '999px',
                  background: j === fechaActual ? '#d99a1c' : '#fff',
                  color: j === fechaActual ? '#3a2a05' : '#666',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  transition: 'all .15s'
                }}
              >
                {label}
              </button>
            )
          })}
        </div>
      )}

      <div className="card">
        {partidos.length > 0 ? (
          <>
            {fase === 'Grupos' && fechaActual && (
              <>
                <div className="group-title">Fecha {fechaActual}</div>
                {Object.entries(gruposDeJornada).map(([grupo, ps]) => (
                  <div key={grupo}>
                    <div className="group-title" style={{ marginTop: '0.8rem' }}>Grupo {grupo}</div>
                    {ps.map(renderMatch)}
                  </div>
                ))}
              </>
            )}
            {fase !== 'Grupos' && partidos.map(renderMatch)}
          </>
        ) : (
          <div style={{ color: '#aaa', fontSize: 13, padding: '1rem 0' }}>
            Esta fase se activa a medida que avanza el torneo.
          </div>
        )}
      </div>

      <div className="save-bar">
        <button className="btn-save" onClick={handleSave} disabled={saving}>
          {saving ? 'Guardando...' : '💾 Guardar pronósticos'}
        </button>
        <span className={`save-confirm ${saved ? 'show' : ''}`}>✅ ¡Guardado!</span>
      </div>
    </div>
  )
}
