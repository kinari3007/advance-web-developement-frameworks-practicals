import { useEffect, useState, useRef } from 'react'
import Spinner from '../components/Spinner'
import ErrorMessage from '../components/ErrorMessage'

export default function GithubRepos() {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const ref = useRef(null)

  const fetchRepos = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('https://api.github.com/users/kinari3007/repos')
      if (!response.ok) throw new Error(`Request failed with status ${response.status}`)
      const data = await response.json()
      setRepos(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load repositories right now.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRepos()
  }, [])

  // Scroll reveal after data loads
  useEffect(() => {
    if (loading || !ref.current) return
    const items = ref.current.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.06 }
    )
    items.forEach(item => observer.observe(item))
    return () => observer.disconnect()
  }, [loading, repos])

  const filteredRepos = repos.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <Spinner />
  if (error) return <ErrorMessage message={error} onRetry={fetchRepos} />

  return (
    <section className="section" ref={ref}>
      <div className="container">
        <div className="section-header reveal">
          <span className="section-label">Live GitHub Feed</span>
          <h2 className="section-title">
            GitHub <em>Repositories</em>
          </h2>
          <p className="repos-intro">
            Discover the latest repositories I&apos;ve published and keep track of my active work.
          </p>
        </div>

        <div className="repos-controls reveal reveal-delay-1">
          <input
            type="text"
            className="repos-search"
            placeholder="Search repositories..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            aria-label="Search repositories"
          />
        </div>

        {filteredRepos.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
            No repositories match &ldquo;{searchTerm}&rdquo;.
          </p>
        ) : (
          <div className="repos-grid">
            {filteredRepos.map((repo, i) => (
              <article
                key={repo.id}
                className={`repo-card reveal reveal-delay-${(i % 4) + 1}`}
              >
                <div className="repo-card-content">
                  <h3 className="repo-title">{repo.name}</h3>
                  <p className="repo-description">
                    {repo.description || 'No description available for this repository yet.'}
                  </p>
                </div>
                <div className="repo-card-footer">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="repo-link"
                  >
                    View on GitHub →
                  </a>
                  <span className="repo-stars">
                    <span className="star-icon">★</span>
                    {repo.stargazers_count}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
