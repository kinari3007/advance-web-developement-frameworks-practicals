import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/',        label: 'Home' },
  { path: '/skills',  label: 'Skills' },
  { path: '/projects',label: 'Projects' },
  { path: '/repos',   label: 'GitHub' },
  { path: '/todo',    label: 'To-Do' },
  { path: '/contact', label: 'Contact' },
]

export default function NavBar({ theme, toggleTheme }) {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}${menuOpen ? ' menu-open' : ''}`}>
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo" aria-label="Home">
          <span className="nav-logo-dot" aria-hidden="true" />
          <span className="nav-logo-text">KT</span>
          <span style={{ color: 'var(--text-muted)', fontWeight: 300 }}>/</span>
          <span style={{ color: 'var(--text-muted)', fontWeight: 300, fontSize: '9px', letterSpacing: '0.12em' }}>Portfolio</span>
        </Link>

        {/* Mobile toggle */}
        <button
          className="nav-menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          onClick={() => setMenuOpen(o => !o)}
        >
          <span />
          <span />
        </button>

        {/* Links */}
        <ul className="nav-links" onClick={() => setMenuOpen(false)}>
          {navItems.map(({ path, label }) => (
            <li key={path}>
              <Link
                to={path}
                className={`nav-link${location.pathname === path ? ' active' : ''}`}
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <button
              className="theme-toggle"
              onClick={e => { e.stopPropagation(); toggleTheme() }}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              type="button"
            >
              {theme === 'dark' ? '◑ Light' : '● Dark'}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}
