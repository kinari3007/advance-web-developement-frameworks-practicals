import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/skills', label: 'Skills' },
  { path: '/projects', label: 'Projects' },
  { path: '/repos', label: 'GitHub Repos' },
  { path: '/todo', label: 'To-Do' },
  { path: '/contact', label: 'Contact' }
]

export default function NavBar({ theme, toggleTheme }) {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className={`navbar ${menuOpen ? 'menu-open' : ''}`}>
      <div className="nav-container">
        <button className="nav-menu-toggle" type="button" aria-expanded={menuOpen} aria-label="Toggle navigation" onClick={() => setMenuOpen((open) => !open)}>
          <span /><span />
        </button>
        <ul className="nav-links" onClick={() => setMenuOpen(false)}>
          {navItems.map(({ path, label }) => (
            <li key={path}>
              <Link
                to={path}
                className={`nav-link ${location.pathname === path ? 'active' : ''}`}
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <button
              className="nav-link theme-toggle"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              style={{ marginLeft: '12px' }}
            >
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}