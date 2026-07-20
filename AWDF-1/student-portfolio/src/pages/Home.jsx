import { useState } from 'react'
import { portfolioData } from '../data'

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
    <div>
      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-content">
          <h1 className="hero-title">{portfolioData.name}</h1>
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

      {/* About Section */}
      <section id="about" className="section">
        <div className="container">
          <div className="card">
            <span className="section-label">About Me</span>
            <h2 className="section-title">Hey there! 👋</h2>
            
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