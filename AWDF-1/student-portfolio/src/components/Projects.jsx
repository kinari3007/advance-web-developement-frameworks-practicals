import { useEffect, useRef } from 'react'

export default function Projects({ projectList }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const items = el.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.08 }
    )
    items.forEach(item => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="projects" className="section">
      <div className="container" ref={ref}>
        <div className="section-header reveal">
          <span className="section-label">Featured Work</span>
          <h2 className="section-title">
            Projects &amp; <em>Portfolio</em>
          </h2>
        </div>

        <div className="projects-editorial">
          {projectList.map((project, index) => (
            <article
              key={index}
              className={`project-editorial-row reveal reveal-delay-${(index % 3) + 1}${index % 2 !== 0 ? ' reverse' : ''}`}
            >
              {/* Visual panel */}
              <div className="project-visual">
                <div className="project-visual-inner">
                  <div className="project-visual-glow" />
                  <div className="project-visual-grid" />
                  <span className="project-visual-number">0{index + 1}</span>
                </div>
              </div>

              {/* Text content */}
              <div className="project-info">
                <p className="project-number">— Project 0{index + 1}</p>
                <h3 className="project-title">
                  <strong>{project.title}</strong>
                </h3>
                <p className="project-description">{project.description}</p>

                <div className="project-tech">
                  {project.techStack.map((tech, ti) => (
                    <span key={ti} className="tech-tag">{tech}</span>
                  ))}
                </div>

                <div className="project-actions">
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-link"
                  >
                    View Project <span>↗</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
