import { useEffect, useRef } from 'react'
import { portfolioData } from '../data'
import JellyfishVisual from '../components/JellyfishVisual'

const scrollToSection = (id) => {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// Reusable reveal hook
function useReveal(ref) {
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
  }, [ref])
}

// ── Hero ─────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section id="home" className="hero">
      <div className="hero-meta">
        <span><span className="hero-meta-line" aria-hidden="true" />Portfolio&nbsp;·&nbsp;2026</span>
        <span>India&nbsp;/&nbsp;AI-ML&nbsp;Engineer</span>
      </div>

      {/* Cosmic wave visual (right side) */}
      <JellyfishVisual />

      <div className="hero-content">
        <p className="eyebrow">AIML Developer · Data Analyst</p>
        <h1 className="hero-title">
          Kinari<br />
          <strong>Thummar</strong>
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
          <button
            className="btn-primary"
            type="button"
            onClick={() => scrollToSection('projects')}
          >
            Explore My Work
          </button>
          <button
            className="btn-outline"
            type="button"
            onClick={() => scrollToSection('contact')}
          >
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
        <span className="scroll-line" aria-hidden="true" />
        <span className="scroll-arrow" aria-hidden="true">↓</span>
        <span>Scroll</span>
      </button>

      <div className="hero-orbit orbit-one" aria-hidden="true" />
      <div className="hero-orbit orbit-two" aria-hidden="true" />
    </section>
  )
}

// ── About (inline, Home page) ────────────────────────────────
function AboutSection() {
  const ref = useRef(null)
  useReveal(ref)

  const tags = ['India', 'B.Tech AI-ML', 'Problem Solver', 'Quick Learner', 'Innovation']

  return (
    <section id="about" className="section" ref={ref}>
      <div className="container">
        <div className="about-editorial">

          {/* Sticky heading column */}
          <div className="about-heading-col">
            <span className="about-number reveal" aria-hidden="true">01</span>
            <span className="section-label reveal reveal-delay-1">About Me</span>
            <h2 className="about-big-title reveal reveal-delay-2">
              WHO<br /><strong>I AM.</strong>
            </h2>
            <div className="about-tags reveal reveal-delay-3">
              {tags.map((tag, i) => (
                <span key={i} className="about-tag">{tag}</span>
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="about-body-col">
            <p className="about-bio-text reveal">
              {portfolioData.bio}
            </p>

            <div className="about-stats-row reveal reveal-delay-2">
              <div className="about-stat">
                <span className="about-stat-value">{portfolioData.projectList.length}+</span>
                <span className="about-stat-label">Projects Built</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-value">{portfolioData.skillList.length}+</span>
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

// ── Skills (inline, Home page) ───────────────────────────────
function SkillsSection() {
  const ref = useRef(null)
  useReveal(ref)

  const skillCategories = [
    {
      index: '01',
      title: 'Languages',
      skills: portfolioData.skillList.filter(s =>
        ['Python', 'Java', 'C++', 'C Programming', 'HTML', 'CSS'].includes(s)
      ),
    },
    {
      index: '02',
      title: 'AI & Machine Learning',
      skills: portfolioData.skillList.filter(s =>
        ['Machine Learning', 'Data Science', 'Scikit-learn', 'TensorFlow'].includes(s)
      ),
    },
    {
      index: '03',
      title: 'Data & Analytics',
      skills: portfolioData.skillList.filter(s =>
        ['Pandas', 'NumPy', 'SQL', 'MongoDB', 'Postgre SQL', 'SupaBase', 'Data Visualization'].includes(s)
      ),
    },
    {
      index: '04',
      title: 'Tools & Platforms',
      skills: portfolioData.skillList.filter(s =>
        ['Git', 'Power BI', 'Streamlit'].includes(s)
      ),
    },
  ]

  return (
    <section id="skills" className="section" ref={ref}>
      <div className="container">
        <div className="skills-surface">
          <div className="skills-grid-header">
            <div className="reveal">
              <span className="section-label">Technical Stack</span>
              <h2 className="section-title">
                The tools I<br /><em>think with.</em>
              </h2>
            </div>
            <p
              className="reveal reveal-delay-2"
              style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '280px', lineHeight: '1.7' }}
            >
              {portfolioData.skillList.length} technologies across AI, data, and software engineering.
            </p>
          </div>

          <div className="skills-content">
            {skillCategories.map((cat, i) =>
              cat.skills.length > 0 && (
                <div key={i} className={`skills-category reveal reveal-delay-${i + 1}`}>
                  <h3 className="category-title">
                    <span>{cat.index}</span>{cat.title}
                  </h3>
                  <div className="skills-list">
                    {cat.skills.map((skill, j) => (
                      <span key={j} className="skill-badge">{skill}</span>
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

// ── Projects (inline, Home page) ────────────────────────────
function ProjectsSection() {
  const ref = useRef(null)
  useReveal(ref)

  return (
    <section id="projects" className="section" ref={ref}>
      <div className="container">
        <div className="section-header reveal">
          <span className="section-label">Featured Work</span>
          <h2 className="section-title">
            Projects &amp; <em>Portfolio</em>
          </h2>
        </div>

        <div className="projects-editorial">
          {portfolioData.projectList.map((project, index) => (
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

              {/* Info */}
              <div className="project-info">
                <p className="project-number">— Project 0{index + 1}</p>
                <h3 className="project-title"><strong>{project.title}</strong></h3>
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

// ── Contact (inline, Home page) ──────────────────────────────
function ContactSection() {
  const ref = useRef(null)
  useReveal(ref)

  const contactLinks = [
    { label: 'Email',    href: 'mailto:kinarithummar@gmail.com',                        icon: '✉' },
    { label: 'Phone',    href: 'tel:+91-9106820342',                                    icon: '☎' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/kinari-thummar-97417b321/', icon: '↗' },
    { label: 'GitHub',   href: 'https://github.com/kinari3007',                         icon: '↗' },
  ]

  return (
    <section id="contact" className="section" ref={ref}>
      <div className="container">
        <div className="reveal">
          <span className="section-label">Get In Touch</span>
          <h2 className="section-title">Let's <em>Connect</em></h2>
        </div>

        <p
          className="reveal reveal-delay-1"
          style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.85', maxWidth: '520px', marginBottom: '40px' }}
        >
          Always open to discussing new opportunities, collaborating on interesting
          problems, or just talking tech.
        </p>

        <div className="contact-links reveal reveal-delay-2" style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {contactLinks.map((link, i) => (
            <a
              key={i}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="contact-btn"
            >
              <span className="contact-icon">{link.icon}</span>
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Home page ────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="home-page">
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ContactSection />
    </div>
  )
}
