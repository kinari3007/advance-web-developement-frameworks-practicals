const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

export default function Header({ name }) {
  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <h1 className="hero-title">{name}</h1>
        <div className="hero-subtitle">AI-ML Engineering Student</div>
        <p className="hero-intro">
          Building intelligent solutions that bridge the gap between data and real-world impact. 
          Passionate about machine learning, analytics, and creating user-focused experiences 
          that make technology more accessible and intuitive.
        </p>
        
        <div className="hero-actions">
          <button 
            className="btn-primary" 
            onClick={() => scrollToSection('projects')}
          >
            See My Work
          </button>
        </div>
      </div>
    </section>
  )
}