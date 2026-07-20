export default function About({ bio }) {
  const infoChips = [
    { icon: "📍", text: "India" },
    { icon: "🎓", text: "B.Tech AI-ML Student" },
    { icon: "💡", text: "Problem Solver" },
    { icon: "🚀", text: "Innovation Enthusiast" },
    { icon: "⚡", text: "Quick Learner" }
  ]

  return (
    <section id="about" className="section">
      <div className="container">
        <div className="card">
          <span className="section-label">About Me</span>
          <h2 className="section-title">Hey there! 👋</h2>
          
          <div className="about-content">
            <p className="about-bio">{bio}</p>
            
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
  )
}