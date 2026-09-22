import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="section">
      <div className="container">
        <div className="not-found-wrapper">
          <div style={{ textAlign: 'center', maxWidth: '520px', margin: '0 auto' }}>
            <p className="not-found-code">404</p>
            <h2 style={{
              font: '300 clamp(24px,4vw,40px)/1.1 var(--font-heading)',
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              marginBottom: '20px',
            }}>
              Page Not Found
            </h2>
            <p style={{
              fontSize: '15px',
              color: 'var(--text-muted)',
              lineHeight: '1.8',
              marginBottom: '44px',
            }}>
              The page you&apos;re looking for doesn&apos;t exist. It may have been moved,
              deleted, or you entered the wrong URL.
            </p>
            <Link to="/" className="btn-primary">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
