import { useEffect, useRef } from 'react'

const contactLinks = [
  { label: 'Email',    href: 'mailto:kinarithummar@gmail.com',                        icon: '✉' },
  { label: 'Phone',    href: 'tel:+91-9106820342',                                    icon: '↗' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/kinari-thummar-97417b321/', icon: '↗' },
  { label: 'GitHub',   href: 'https://github.com/kinari3007',                         icon: '↗' },
]

export default function Contact() {
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
    <section id="contact" className="section" ref={ref}>
      <div className="container">
        <div className="reveal">
          <span className="section-label">Get In Touch</span>
          <h2 className="section-title">
            Let's <em>Connect</em>
          </h2>
        </div>

        <p className="contact-invite reveal reveal-delay-1" style={{ maxWidth: '540px', marginBottom: '48px' }}>
          Always open to discussing new opportunities, collaborating on interesting problems,
          or just talking tech. Feel free to reach out through any channel.
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
