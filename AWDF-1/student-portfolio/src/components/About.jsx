import { useState, useEffect, useRef } from 'react'

export default function About({ bio }) {
  const [showMore, setShowMore] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('visible') },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const tags = ['India', 'B.Tech AI-ML', 'Problem Solver', 'Quick Learner', 'Innovation']

  return (
    <section id="about" className="section">
      <div className="container">
        <div ref={ref} className="about-editorial reveal">

          {/* Left: sticky heading column */}
          <div className="about-heading-col">
            <span className="about-number" aria-hidden="true">01</span>
            <span className="section-label">About Me</span>
            <h2 className="about-big-title">
              WHO<br />
              <strong>I AM.</strong>
            </h2>
            <div className="about-tags">
              {tags.map((tag, i) => (
                <span key={i} className="about-tag">{tag}</span>
              ))}
            </div>
          </div>

          {/* Right: body content */}
          <div className="about-body-col">
            <p className="about-bio-text">{bio}</p>

            {/* Expandable section */}
            <div className="expandable-bio">
              <button
                className="btn-outline"
                onClick={() => setShowMore(v => !v)}
                type="button"
              >
                {showMore ? '− Read Less' : '+ Read More'}
              </button>

              {showMore && (
                <div className="expanded-bio-content">
                  <p className="about-bio-text" style={{ marginBottom: 0 }}>
                    I'm passionate about leveraging artificial intelligence and machine learning
                    to solve real-world problems. My journey in AI-ML has been driven by curiosity
                    and a desire to create technology that makes a meaningful impact. I enjoy working
                    on projects that challenge me to think creatively and push the boundaries of what's
                    possible with data and algorithms.
                  </p>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="about-stats-row reveal reveal-delay-2">
              <div className="about-stat">
                <span className="about-stat-value">3+</span>
                <span className="about-stat-label">Projects Built</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-value">20+</span>
                <span className="about-stat-label">Technologies</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-value">3rd</span>
                <span className="about-stat-label">Year B.Tech</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
