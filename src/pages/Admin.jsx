import { useState, useEffect } from 'react'
import { supabase, cargarResultado } from '../lib/supabase'
import { PARTIDOS_GRUPOS, PARTIDOS_ELIMINATORIOS } from '../lib/fixture'
import Flag from '../components/Flag'

export default function Admin() {
  const [partidos, setPartidos] = useState([])
  const [resultados, setResultados] = useState({})
  const [saving, setSaving] = useState(null)
  const [fase, setFase] = useState('Grupos')
  const [msg, setMsg] = useState('')

  const todosLosPartidos = [...PARTIDOS_GRUPOS, ...PARTIDOS_ELIMINATORIOS]

  useEffect(() => {
    supabase.from('partidos').select('*').then(({ data }) => {
      if (data) {
        const map = {}
        data.forEach((p) => {
          map[p.id] = { local: p.resultado_local, visitante: p.resultado_visitante, jugado: p.jugado }
        })
        setPartidos(data)
        setResultados(map)
      }
    })
  }, [])

  async function handleCargar(partidoId) {
    const r = resultados[partidoId]
    if (r?.local === undefined || r?.visitante === undefined) return
    setSaving(partidoId)
    try {
      await cargarResultado({
        partidoId,
        golesLocal: parseInt(r.local),
        golesVisitante: parseInt(r.visitante),
      })
      setMsg(`✅ Resultado del partido ${partidoId} cargado. Los puntos se calcularon automáticamente.`)
      setTimeout(() => setMsg(''), 4000)
    } catch (err) {
      setMsg('❌ Error: ' + err.message)
    }
    setSaving(null)
  }

  function handleResultado(id, side, val) {
    setResultados((prev) => ({
      ...prev,
      [id]: { ...prev[id], [side]: val },
    }))
  }

  const filtrados = todosLosPartidos.filter((p) => p.fase === fase)
  const fases = ['Grupos', 'R16', 'QF', 'SF', 'F']

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: '1rem' }}>🔧 Panel de administración</h2>
      <div className="alert alert-warning">
        Este panel es solo para administradores. Acá cargás los resultados reales y los puntos se calculan automáticamente vía Supabase.
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}

      <div className="phase-tabs">
        {fases.map((f) => (
          <button key={f} className={`tab-btn ${fase === f ? 'active' : ''}`} onClick={() => setFase(f)}>
            {f}
          </button>
        ))}
      </div>

      <div className="card">
        {filtrados.map((p) => {
          const r = resultados[p.id] || {}
          const jugado = r.jugado
          return (
            <div className="admin-result-row" key={p.id}>
              <span style={{ flex: 1, fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Flag name={p.local} emoji={p.flagLocal} /> {p.local}
              </span>
              <div className="score-inputs">
                <input
                  className="score-input"
                  type="number" min="0" max="20"
                  value={r.local ?? ''}
                  onChange={(e) => handleResultado(p.id, 'local', e.target.value)}
                  disabled={jugado}
                  style={{ width: 44 }}
                />
                <span className="score-sep">-</span>
                <input
                  className="score-input"
                  type="number" min="0" max="20"
                  value={r.visitante ?? ''}
                  onChange={(e) => handleResultado(p.id, 'visitante', e.target.value)}
                  disabled={jugado}
                  style={{ width: 44 }}
                />
              </div>
              <span style={{ flex: 1, fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                {p.visitante} <Flag name={p.visitante} emoji={p.flagVisitante} />
              </span>
              <button
                className="btn-save"
                onClick={() => handleCargar(p.id)}
                disabled={jugado || saving === p.id}
                style={{ marginLeft: 8, fontSize: 12, padding: '5px 12px' }}
              >
                {jugado ? '✅ Cargado' : saving === p.id ? '...' : 'Cargar'}
              </button>
            </div>
          )
        })}
      </div>

      <div className="card" style={{ marginTop: '1rem' }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>🗓 Calcular ganador semanal</h3>
        <div style={{ fontSize: 13, color: '#666', marginBottom: 10 }}>
          Ejecutá esta función en el SQL Editor de Supabase cada domingo:
        </div>
        <pre style={{ background: '#f5f5f0', padding: '10px 14px', borderRadius: 8, fontSize: 12, overflowX: 'auto', color: '#333' }}>
{`-- Semana 1 (cambiar fechas según corresponda)
select public.calcular_ganador_semanal(
  1,
  '2026-06-11',
  '2026-06-17'
);`}
        </pre>
      </div>
    </div>
  )
}
