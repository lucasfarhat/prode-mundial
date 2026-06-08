import { useState, useEffect } from 'react'
import { getGanadoresSemanales } from '../lib/supabase'

export default function Semanal() {
  const [ganadores, setGanadores] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getGanadoresSemanales().then((data) => {
      setGanadores(data || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  // Calcular semana actual (para mostrar cuándo es la próxima)
  const hoy = new Date()
  const diasHastaLunes = (hoy.getDay() + 6) % 7
  const lunes = new Date(hoy)
  lunes.setDate(hoy.getDate() - diasHastaLunes)
  const domingo = new Date(lunes)
  domingo.setDate(lunes.getDate() + 6)

  const fmtFecha = (d) => d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: '1rem' }}>Ganador semanal</h2>

      <div className="alert alert-success">
        📅 El ganador se calcula cada <strong>domingo a las 23:59 hs</strong> con los partidos de esa semana.
        <br />
        Semana actual: {fmtFecha(lunes)} al {fmtFecha(domingo)}
      </div>

      {loading ? (
        <div style={{ color: '#aaa', padding: '1rem' }}>Cargando...</div>
      ) : ganadores.length === 0 ? (
        <div className="alert alert-info">
          Todavía no hay ganadores semanales. El primer ganador se anunciará el domingo {fmtFecha(domingo)}.
        </div>
      ) : (
        ganadores.map((g, i) => (
          <div className="winner-card" key={g.id}>
            <div>
              <div className="winner-week">Semana {g.semana} · {g.fecha_inicio} al {g.fecha_fin}</div>
              <div className="winner-name">{i === 0 ? '🥇 ' : ''}{g.nombre_ganador}</div>
            </div>
            <div>
              <div className="winner-pts">{g.puntos_semana}</div>
              <div className="winner-detail">{g.exactos_semana} exactos · dif {g.diferencia_semana}</div>
            </div>
          </div>
        ))
      )}

      <div className="card">
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Cómo se define el ganador semanal</h3>
        <div style={{ fontSize: 13, color: '#666', lineHeight: 1.7 }}>
          <p style={{ marginBottom: 6 }}>1. Mayor cantidad de <strong>puntos</strong> en los partidos de la semana.</p>
          <p style={{ marginBottom: 6 }}>2. En caso de empate: más <strong>resultados exactos</strong>.</p>
          <p>3. Si persiste: menor <strong>diferencia acumulada de goles</strong> (suma de |pronóstico - real| en cada partido).</p>
        </div>
      </div>
    </div>
  )
}
