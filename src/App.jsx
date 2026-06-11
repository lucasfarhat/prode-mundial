import { useState, useEffect } from 'react'
import { supabase, getSession } from './lib/supabase'
import faguLogo from './assets/fagu-logo.png'
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
    // Timeout de seguridad: nunca dejar la app colgada en "Cargando..."
    const failsafe = setTimeout(() => setLoading(false), 3000)

    getSession()
      .then((s) => {
        setSession(s)
        if (s?.user) setTimeout(() => fetchPerfil(s.user.id), 0)
      })
      .catch((err) => {
        console.error('getSession error:', err)
      })
      .finally(() => {
        clearTimeout(failsafe)
        setLoading(false)
      })

    // El callback NO debe ser async ni llamar a supabase directamente:
    // deja tomado el lock interno de auth y getSession() queda esperando
    // para siempre (pantalla "Cargando..." hasta refrescar).
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      if (s?.user) setTimeout(() => fetchPerfil(s.user.id), 0)
      else setPerfil(null)
    })
    return () => {
      clearTimeout(failsafe)
      listener.subscription.unsubscribe()
    }
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
        <div className="header-bar">
          <img className="brand-logo" src={faguLogo} alt="fagú Comida Árabe" />
          <div className="brand-divider" />
          <div className="brand-text">
            <div className="brand-kicker">fagú · Comida Árabe</div>
            <div className="brand-title">Prode Mundial <span>2026</span></div>
            <div className="brand-sub">⚽ México · EE.UU. · Canadá</div>
          </div>
          {session && perfil && (
            <div className="user-chip">Hola, {perfil.nombre.split(' ')[0]}</div>
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

      <footer className="site-footer">
        <img className="footer-logo" src={faguLogo} alt="fagú" />
        <div className="footer-text">Organiza <b>fagú</b> · Comida Árabe</div>
        <div className="footer-mini">Prode Mundial 2026</div>
      </footer>
    </div>
  )
}
