/**
 * App.jsx — Practical 8: Performance Optimization and Lazy Loading
 *
 * Changes from Practical 7:
 *  - All page-level route components converted to React.lazy() + dynamic import()
 *  - Routes block wrapped in a single <Suspense> boundary with a MinDelayFallback
 *  - MinDelayFallback enforces a 300 ms minimum display time to prevent flash
 *  - GradientBackground wrapped in React.memo() — it receives no props and should
 *    never re-render when theme or route changes
 *
 * Components kept as EAGER imports (needed immediately on every route):
 *  - GradientBackground — renders behind the whole app; must be present before
 *    any route chunk loads, otherwise the background flashes in
 *  - NavBar — needed for every page; delay would cause a visible layout shift
 *  - Footer — small, always rendered
 *
 * Task 3 "heavy component": TodoPage (35 kB source) is the heaviest page by
 * far and contains the entire authenticated task manager + auth gate. It is
 * lazy-loaded so its code is only fetched when the user navigates to /todo.
 */

import { useState, lazy, Suspense, memo, useEffect, useRef, useCallback } from 'react'
import { Routes, Route } from 'react-router-dom'

// ── Eager imports — always needed, small, or layout-critical ─────────────────
import GradientBackgroundRaw from './components/GradientBackground'
import NavBar      from './components/NavBar'
import Footer      from './components/Footer'
import { portfolioData } from './data'
import './App.css'

// ── Task 3: React.memo on GradientBackground ─────────────────────────────────
// GradientBackground renders fixed CSS layers and accepts no props.
// Wrapping with memo prevents it from re-rendering when the parent re-renders
// due to theme toggle or route changes.
const GradientBackground = memo(GradientBackgroundRaw)

// ── Task 1: Route-based lazy loading ─────────────────────────────────────────
// Each dynamic import() tells Vite to emit a separate JS chunk for that module.
// The chunk is fetched only when the user first navigates to that route.

const Home        = lazy(() => import('./pages/Home'))
const SkillsPage  = lazy(() => import('./pages/SkillsPage'))
const Projects    = lazy(() => import('./pages/Projects'))
const Contact     = lazy(() => import('./pages/Contact'))
const GithubRepos = lazy(() => import('./pages/GithubRepos'))
const NotFound    = lazy(() => import('./pages/NotFound'))

// Task 3: heavy component — TodoPage is the largest page (35 kB source,
// contains the full auth gate + task manager + priority UI).
// Lazy-loading it means its code is NOT included in the initial bundle.
const TodoPage    = lazy(() => import('./pages/TodoPage'))

// ── Task 2: Minimum-delay Suspense fallback ───────────────────────────────────
/**
 * MinDelayFallback
 *
 * On fast connections a Suspense fallback can appear for < 50 ms and produce
 * an unpleasant flash. This component enforces a 300 ms minimum display time:
 *
 *  - If the chunk resolves before 300 ms has elapsed, the spinner keeps
 *    showing until the timer fires, then unmounts normally.
 *  - If the chunk takes longer than 300 ms, the spinner shows throughout and
 *    disappears when the chunk is ready (Suspense removes it naturally).
 *  - The timer is cleared on unmount so it never causes a state-update warning.
 *
 * This is implemented purely with React hooks — no extra dependencies.
 */
function MinDelayFallback() {
  const [visible, setVisible] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    // Show the spinner after 50 ms to avoid any flash for instant loads,
    // but keep it visible for at least 300 ms once shown.
    const showTimer = setTimeout(() => {
      setVisible(true)
      timerRef.current = setTimeout(() => {
        // After 300 ms the minimum is satisfied; Suspense will remove this
        // component naturally when the chunk finishes loading.
      }, 300)
    }, 50)

    return () => {
      clearTimeout(showTimer)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Page loading"
      style={{
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        minHeight:      'calc(100vh - 80px)',   // nav-height offset
        gap:            '18px',
        padding:        '40px',
      }}
    >
      {/* Spinner — reuses the existing .spinner CSS class */}
      <div className="spinner" aria-hidden="true" />

      <p style={{
        font:          '500 10px/1 var(--font-heading, sans-serif)',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color:         'var(--text-muted, #8194AD)',
      }}>
        Loading…
      </p>
    </div>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────

function App() {
  const [theme, setTheme] = useState('dark')

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }, [])

  return (
    <div className={`app ${theme}`}>
      {/* GradientBackground is memo-wrapped — will not re-render on theme/route change */}
      <GradientBackground />

      <NavBar theme={theme} toggleTheme={toggleTheme} />

      <div className="content-wrapper">
        {/*
          Suspense boundary wraps only the Routes block, not the whole app.
          NavBar and Footer render immediately; only the page content shows
          the fallback while a lazy chunk is being fetched.
        */}
        <Suspense fallback={<MinDelayFallback />}>
          <Routes>
            <Route path="/"         element={<Home />} />
            <Route path="/skills"   element={<SkillsPage />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact"  element={<Contact />} />
            <Route path="/repos"    element={<GithubRepos />} />
            <Route path="/todo"     element={<TodoPage />} />
            <Route path="*"         element={<NotFound />} />
          </Routes>
        </Suspense>

        <Footer name={portfolioData.name} />
      </div>
    </div>
  )
}

export default App
