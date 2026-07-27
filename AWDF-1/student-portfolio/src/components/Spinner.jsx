export default function Spinner() {
  return (
    <section className="section">
      <div className="container">
        <div className="spinner-wrapper" role="status" aria-live="polite">
          <div className="spinner" aria-label="Loading repositories" />
        </div>
      </div>
    </section>
  )
}
