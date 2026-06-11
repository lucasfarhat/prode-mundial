import { useState, useEffect } from 'react'
import { supabase, guardarPronostico, getPronosticosUsuario } from '../lib/supabase'
import { PARTIDOS_GRUPOS, PARTIDOS_ELIMINATORIOS } from '../lib/fixture'
import Flag from '../components/Flag'

const FASES = [
  { id: 'Grupos', label: 'Grupos' },
  { id: 'R16', label: 'Octavos' },
  { id: 'QF', label: 'Cuartos' },
  { id: 'SF', label: 'Semis' },
  { id: 'F', label: 'Final' },
]

function isLocked(fechaStr) {
  const fecha = new Date(fechaStr)
  const ahora = new Date()
  return ahora >= new Date(fecha.getTime() - 5 * 60 * 1000)
}

function formatFecha(fechaStr) {
  const d = new Date(fechaStr)
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
}

export default function Fixture({ session }) {
  const [fase, setFase] = useState('Grupos')
  const [fechaActual, setFechaActual] = useState(null)
  const [pronosticos, setPronosticos] = useState({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [dbPartidos, setDbPartidos] = useState([])

  const todosLosPartidos = [...PARTIDOS_GRUPOS, ...PARTIDOS_ELIMINATORIOS]

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
      if (data?.length) {
        setDbPartidos(data)
        // Auto-detectar la primera fecha de la fase actual
        const partidosDeFase = data.filter(p => p.fase === fase)
        if (partidosDeFase.length && !fechaActual) {
          const fechas = [...new Set(partidosDeFase.map(p => p.fecha))].sort()
          setFechaActual(fechas[0])
        }
      }
    })
  }, [session, fase, fechaActual])

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

  // Extraer fechas únicas y ordenadas
  const fechas = [...new Set(partidosDeFase.map(p => p.fecha))].sort()

  // Auto-avanzar a la siguiente fecha cuando la actual termina
  useEffect(() => {
    if (!fechaActual || fechas.length === 0) return
    const partidosDeHoy = partidosDeFase.filter(p => p.fecha === fechaActual)
    const todosTerminaron = partidosDeHoy.every(p => {
      const real = dbPartidos.find(r => r.id === p.id)
      return real?.jugado
    })
    if (todosTerminaron && fechas.indexOf(fechaActual) < fechas.length - 1) {
      const proximaFechaIdx = fechas.indexOf(fechaActual) + 1
      setFechaActual(fechas[proximaFechaIdx])
    }
  }, [dbPartidos, fechaActual, fechas, partidosDeFase])

  // Mostrar partidos de la fecha actual
  const partidos = partidosDeFase.filter(p => p.fecha === fechaActual)

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
        🔒 Los pronósticos se cierran 1 hora antes de cada partido.
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

      {fase === 'Grupos' && fechas.length > 0 && (
        <div style={{ display: 'flex', gap: 6, marginBottom: '1rem', overflowX: 'auto', paddingBottom: 4 }}>
          {fechas.map((f, idx) => {
            const fecha = new Date(f)
            const label = 'Fecha ' + (idx + 1)
            return (
              <button
                key={f}
                onClick={() => setFechaActual(f)}
                style={{
                  padding: '7px 14px',
                  border: f === fechaActual ? 'none' : '1px solid #ddd',
                  borderRadius: '999px',
                  background: f === fechaActual ? '#d99a1c' : '#fff',
                  color: f === fechaActual ? '#3a2a05' : '#666',
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
              <div className="group-title">Fecha {fechas.indexOf(fechaActual) + 1}</div>
            )}
            {partidos.map(renderMatch)}
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
