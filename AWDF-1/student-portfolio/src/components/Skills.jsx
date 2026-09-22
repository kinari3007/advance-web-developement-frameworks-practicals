import { useEffect, useRef } from 'react'

export default function Skills({ skillList }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const items = el.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.08 }
    )
    items.forEach(item => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  const skillCategories = [
    {
      index: '01',
      title: 'Languages',
      skills: skillList.filter(s =>
        ['Python', 'Java', 'C++', 'C Programming', 'HTML', 'CSS'].includes(s)
      ),
    },
    {
      index: '02',
      title: 'AI & Machine Learning',
      skills: skillList.filter(s =>
        ['Machine Learning', 'Data Science', 'Scikit-learn', 'TensorFlow'].includes(s)
      ),
    },
    {
      index: '03',
      title: 'Data & Analytics',
      skills: skillList.filter(s =>
        ['Pandas', 'NumPy', 'SQL', 'MongoDB', 'Postgre SQL', 'SupaBase', 'Data Visualization'].includes(s)
      ),
    },
    {
      index: '04',
      title: 'Tools & Platforms',
      skills: skillList.filter(s =>
        ['Git', 'Power BI', 'Streamlit'].includes(s)
      ),
    },
  ]

  return (
    <section id="skills" className="section">
      <div className="container" ref={ref}>
        <div className="skills-surface">

          <div className="skills-grid-header">
            <div className="reveal">
              <span className="section-label">Technical Stack</span>
              <h2 className="section-title">
                The tools I<br /><em>think with.</em>
              </h2>
            </div>
            <p className="reveal reveal-delay-2" style={{
              color: 'var(--text-muted)',
              fontSize: '14px',
              maxWidth: '280px',
              lineHeight: '1.7',
            }}>
              {skillList.length} technologies across AI, data, and software engineering.
            </p>
          </div>

          <div className="skills-content">
            {skillCategories.map((cat, i) =>
              cat.skills.length > 0 && (
                <div
                  key={i}
                  className={`skills-category reveal reveal-delay-${i + 1}`}
                >
                  <h3 className="category-title">
                    <span>{cat.index}</span>
                    {cat.title}
                  </h3>
                  <div className="skills-list">
                    {cat.skills.map((skill, j) => (
                      <span
                        key={j}
                        className="skill-badge"
                        style={{ '--skill-index': j }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
