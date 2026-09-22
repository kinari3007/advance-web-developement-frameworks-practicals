export default function ErrorMessage({ message, onRetry }) {
  return (
    <section className="section">
      <div className="container">
        <div className="error-card">
          <h3 className="error-title">Unable to load data</h3>
          <p className="error-message">{message}</p>
          {onRetry && (
            <button type="button" className="retry-button" onClick={onRetry}>
              Try Again
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
