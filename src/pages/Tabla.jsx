import { useState, useEffect } from 'react'
import { getTablaPosiciones } from '../lib/supabase'

export default function Tabla() {
  const [jugadores, setJugadores] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTablaPosiciones().then((data) => {
      setJugadores(data || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ color: '#aaa', padding: '1rem' }}>Cargando tabla...</div>

  const medals = ['🥇', '🥈', '🥉']

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: '1rem' }}>Tabla de posiciones</h2>

      {jugadores.length === 0 ? (
        <div className="alert alert-info">
          Aún no hay pronósticos cargados. ¡Sé el primero en jugar!
        </div>
      ) : (
        <>
          <div className="top3-grid">
            {jugadores.slice(0, 3).map((j, i) => (
              <div className="top3-card" key={j.user_id}>
                <div className="top3-medal">{medals[i]}</div>
                <div className="top3-name">{j.nombre}</div>
                <div className="top3-pts">{j.puntos}</div>
                <div className="top3-sub">pts</div>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: '.5rem 1rem' }}>
            <table className="rank-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Jugador</th>
                  <th style={{ textAlign: 'center' }}>Exactos</th>
                  <th style={{ textAlign: 'center' }}>Ganadores</th>
                  <th style={{ color: '#1a4fa0', textAlign: 'center' }}>Pts</th>
                </tr>
              </thead>
              <tbody>
                {jugadores.map((j, i) => (
                  <tr key={j.user_id}>
                    <td className="rank-num">{i + 1}</td>
                    <td style={{ fontWeight: i < 3 ? 600 : 400 }}>{j.nombre}</td>
                    <td style={{ textAlign: 'center', color: '#555' }}>{j.exactos}</td>
                    <td style={{ textAlign: 'center', color: '#555' }}>{j.ganadores}</td>
                    <td className="rank-pts">{j.puntos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ fontSize: 12, color: '#aaa', marginTop: 8 }}>
            🔄 Actualización en tiempo real · Desempate: exactos → menor diferencia de goles
          </div>
        </>
      )}
    </div>
  )
}
