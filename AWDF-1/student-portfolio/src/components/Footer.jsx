export default function Footer({ name }) {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <p className="footer-text">
            Designed &amp; built by {name}
          </p>
          <span className="footer-dot" aria-hidden="true" />
          <p className="footer-text">© {year}</p>
        </div>
      </div>
    </footer>
  )
}
