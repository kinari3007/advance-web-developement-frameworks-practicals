import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="section" style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: 'calc(100vh - 160px)',
      textAlign: 'center'
    }}>
      <div className="container">
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{ 
              fontSize: 'clamp(60px, 10vw, 120px)',
              fontWeight: '800',
              background: 'var(--gradient-text)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '20px',
              fontFamily: 'var(--font-heading)'
            }}>
              404
            </h1>
            <h2 style={{
              fontSize: 'clamp(24px, 4vw, 36px)',
              color: 'var(--color-white)',
              marginBottom: '20px',
              fontFamily: 'var(--font-heading)'
            }}>
              Page Not Found
            </h2>
            <p style={{
              fontSize: '18px',
              color: 'var(--color-gray-200)',
              marginBottom: '40px',
              lineHeight: '1.6'
            }}>
              Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>
          
          <div>
            <Link 
              to="/" 
              className="btn-primary"
              style={{ 
                display: 'inline-block',
                textDecoration: 'none'
              }}
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}