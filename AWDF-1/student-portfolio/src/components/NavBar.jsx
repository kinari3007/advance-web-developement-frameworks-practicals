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

  return (
    <nav className="navbar">
      <div className="nav-container">
        <ul className="nav-links">
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
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}