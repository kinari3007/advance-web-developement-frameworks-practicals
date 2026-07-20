export default function Footer({ name }) {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="footer">
      <div className="container">
        <p className="footer-text">
          Designed & built by {name} © {currentYear}
        </p>
      </div>
    </footer>
  )
}