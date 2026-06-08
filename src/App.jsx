import { useState, useEffect } from 'react'
import { supabase, getSession } from './lib/supabase'
import Fixture from './pages/Fixture'
import Tabla from './pages/Tabla'
import Semanal from './pages/Semanal'
import Registro from './pages/Registro'
import Reglas from './pages/Reglas'
import Admin from './pages/Admin'

const NAV = [
  { id: 'fixture', label: 'Fixture', icon: '⚽' },
  { id: 'tabla', label: 'Tabla', icon: '🏆' },
  { id: 'semanal', label: 'Semanal', icon: '📅' },
  { id: 'reglas', label: 'Reglas', icon: 'ℹ️' },
]

export default function App() {
  const [section, setSection] = useState('fixture')
  const [session, setSession] = useState(null)
  const [perfil, setPerfil] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSession().then(async (s) => {
      setSession(s)
      if (s?.user) await fetchPerfil(s.user.id)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, s) => {
      setSession(s)
      if (s?.user) await fetchPerfil(s.user.id)
      else setPerfil(null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  async function fetchPerfil(userId) {
    const { data } = await supabase
      .from('perfiles')
      .select('*')
      .eq('id', userId)
      .single()
    setPerfil(data)
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
        Cargando...
      </div>
    )
  }

  const navItems = [
    ...NAV,
    ...(perfil?.es_admin ? [{ id: 'admin', label: 'Admin', icon: '🔧' }] : []),
    session
      ? { id: 'logout', label: 'Salir', icon: '🚪' }
      : { id: 'registro', label: 'Ingresar', icon: '👤' },
  ]

  async function handleNav(id) {
    if (id === 'logout') {
      await supabase.auth.signOut()
      setSection('fixture')
      return
    }
    setSection(id)
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <span className="brand-icon">🏆</span>
            <div>
              <div className="brand-title">Prode Mundial 2026</div>
              <div className="brand-sub">México · EE.UU. · Canadá</div>
            </div>
          </div>
          {session && perfil && (
            <div className="user-info">
              <span className="user-name">Hola, {perfil.nombre.split(' ')[0]}</span>
            </div>
          )}
        </div>
        <nav className="nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-btn ${section === item.id ? 'active' : ''}`}
              onClick={() => handleNav(item.id)}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="main">
        {section === 'fixture' && <Fixture session={session} />}
        {section === 'tabla' && <Tabla />}
        {section === 'semanal' && <Semanal />}
        {section === 'reglas' && <Reglas />}
        {section === 'registro' && <Registro onSuccess={() => setSection('fixture')} />}
        {section === 'admin' && perfil?.es_admin && <Admin />}
      </main>
    </div>
  )
}
