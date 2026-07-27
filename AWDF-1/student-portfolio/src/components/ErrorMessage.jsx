export default function ErrorMessage({ message, onRetry }) {
  return (
    <section className="section">
      <div className="container">
        <div className="error-card">
          <h3 className="error-title">Unable to load repositories</h3>
          <p className="error-message">{message}</p>
          <button type="button" className="retry-button" onClick={onRetry}>
            Retry
          </button>
        </div>
      </div>
    </section>
  )
}
