import { useState } from 'react'
import { portfolioData } from '../data'
import JellyfishVisual from '../components/JellyfishVisual'

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

export default function Home() {
  const [showExpandedBio, setShowExpandedBio] = useState(false)

  const infoChips = [
    { icon: "📍", text: "India" },
    { icon: "🎓", text: "B.Tech AI-ML Student" },
    { icon: "💡", text: "Problem Solver" },
    { icon: "🚀", text: "Innovation Enthusiast" },
    { icon: "⚡", text: "Quick Learner" }
  ]

  const expandedBioText = "I'm passionate about leveraging artificial intelligence and machine learning to solve real-world problems. My journey in AI-ML has been driven by curiosity and a desire to create technology that makes a meaningful impact. I enjoy working on projects that challenge me to think creatively and push the boundaries of what's possible with data and algorithms."

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-meta"><span>Portfolio</span><span>2026 / India</span></div>
        <div className="hero-content">
          <p className="eyebrow">AIML Developer / Data Analyst</p>
          <h1 className="hero-title">{portfolioData.name}</h1>
          <div className="hero-subtitle">AI/ML student <i /> Developer · Designer · Problem Solver</div>
          <p className="hero-intro">
            Building intelligent systems where curious questions meet useful, human-centered products.
          </p>
          
        </div>
        <button className="hero-scroll" type="button" onClick={() => scrollToSection('about')} aria-label="Scroll down to the about section">
          <span className="scroll-line" />
          <span className="scroll-arrow">↓</span>
          <span>Scroll down</span>
        </button>
        <div className="hero-orbit orbit-one" />
        <div className="hero-orbit orbit-two" />
      </section>

      {/* About Section */}
      <section id="about" className="section">
        <div className="container">
          <div className="about-intro">
            <span className="section-label">01 / About</span>
            <h2 className="section-title">A mind built<br /><em>beneath the surface.</em></h2>
          </div>
          <div className="card about-card">
            <JellyfishVisual />
            
            <div className="about-content">
              <p className="about-bio">{portfolioData.bio}</p>
              
              {/* Expandable Bio Section */}
              <div className="expandable-bio">
                <button 
                  className="btn-primary" 
                  onClick={() => setShowExpandedBio(!showExpandedBio)}
                  style={{ marginBottom: '20px', fontSize: '14px', padding: '12px 24px' }}
                >
                  {showExpandedBio ? 'Show Less' : 'Read More'}
                </button>
                {showExpandedBio && (
                  <div className="expanded-bio-content" style={{
                    marginBottom: '30px',
                    padding: '20px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '15px',
                    border: '1px solid rgba(59, 130, 246, 0.2)'
                  }}>
                    <p className="about-bio">{expandedBioText}</p>
                  </div>
                )}
              </div>
              
              <div className="info-chips">
                {infoChips.map((chip, index) => (
                  <span key={index} className="info-chip">
                    <span className="chip-icon">{chip.icon}</span>
                    {chip.text}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}