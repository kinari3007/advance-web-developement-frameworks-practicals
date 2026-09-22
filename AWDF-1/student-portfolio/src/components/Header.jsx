// Header component — editorial hero section.
// Used as a standalone component; actual hero is rendered inside Home.jsx.
// Preserved here so the import in App.jsx (if any) doesn't break.

const scrollToSection = (id) => {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function Header({ name }) {
  return (
    <section id="home" className="hero">
      <div className="hero-meta">
        <span><span className="hero-meta-line" />Portfolio</span>
        <span>2026&nbsp;/&nbsp;India</span>
      </div>

      <div className="hero-content">
        <p className="eyebrow">AIML Developer · Data Analyst</p>
        <h1 className="hero-title">
          {name
            ? name.split(' ').map((word, i) =>
                i === 0
                  ? <span key={i}>{word}<br /></span>
                  : <strong key={i}>{word}</strong>
              )
            : 'Kinari\u00a0Thummar'
          }
        </h1>
        <div className="hero-subtitle">
          AI / ML Student
          <span className="hero-subtitle-divider" aria-hidden="true" />
          Developer
          <span className="hero-subtitle-divider" aria-hidden="true" />
          Creator
        </div>
        <p className="hero-intro">
          Building intelligent systems where curious questions meet useful,
          human-centred products.
        </p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => scrollToSection('projects')} type="button">
            Explore My Work
          </button>
          <button className="btn-outline" onClick={() => scrollToSection('contact')} type="button">
            Get In Touch
          </button>
        </div>
      </div>

      <button
        className="hero-scroll"
        type="button"
        onClick={() => scrollToSection('about')}
        aria-label="Scroll to About section"
      >
        <span className="scroll-line" />
        <span className="scroll-arrow">↓</span>
        <span>Scroll</span>
      </button>

      {/* Orbital ring decorations */}
      <div className="hero-orbit orbit-one" aria-hidden="true" />
      <div className="hero-orbit orbit-two" aria-hidden="true" />
    </section>
  )
}
