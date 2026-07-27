import { useEffect, useState } from 'react'
import Spinner from '../components/Spinner'
import ErrorMessage from '../components/ErrorMessage'

export default function GithubRepos() {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchRepos = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('https://api.github.com/users/kinari3007/repos')

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const data = await response.json()
      setRepos(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load repositories right now.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Empty dependency array is required to prevent infinite re-fetching on every render.
    fetchRepos()
  }, [])

  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <Spinner />
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchRepos} />
  }

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Live GitHub Feed</span>
          <h2 className="section-title">GitHub Repositories</h2>
          <p className="repos-intro">
            Discover the latest repositories I&apos;ve published and keep track of my active work.
          </p>
        </div>

        <div className="repos-controls">
          <input
            type="text"
            className="repos-search"
            placeholder="Search repositories..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            aria-label="Search repositories"
          />
        </div>

        <div className="repos-grid">
          {filteredRepos.map((repo) => (
            <article key={repo.id} className="repo-card">
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
      </div>
    </section>
  )
}
