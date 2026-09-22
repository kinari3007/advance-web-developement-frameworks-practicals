import { useState, useEffect, useRef } from 'react'
import emailjs from '@emailjs/browser'

const contactLinks = [
  { label: 'Email',    href: 'mailto:kinarithummar@gmail.com',                        icon: '✉' },
  { label: 'Phone',    href: 'tel:+91-9106820342',                                    icon: '☎' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/kinari-thummar-97417b321/', icon: '↗' },
  { label: 'GitHub',   href: 'https://github.com/kinari3007',                         icon: '↗' },
]

export default function Contact() {
  const [name, setName]       = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus]   = useState('')   // '' | 'sending' | 'success' | 'error'
  const [validationError, setValidationError] = useState('')

  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const items = el.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.06 }
    )
    items.forEach(item => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!name.trim() || !subject.trim() || !message.trim()) {
      setValidationError('Please fill in your name, subject, and message.')
      setStatus('')
      return
    }

    setValidationError('')
    setStatus('sending')

    emailjs
      .send(
        'service_uvp09de',
        'template_y9vjml4',
        { name, subject, message, time: new Date().toLocaleString() },
        'q-J8y3d_bkqmCE9Yb'
      )
      .then(() => {
        setStatus('success')
        setName('')
        setSubject('')
        setMessage('')
      })
      .catch((err) => {
        setStatus('error')
        console.error('EmailJS error:', err)
      })
  }

  return (
    <section id="contact" className="section" ref={ref}>
      <div className="container">

        <div className="reveal">
          <span className="section-label">Get In Touch</span>
          <h2 className="section-title">Let's <em>Connect</em></h2>
        </div>

        <div className="contact-split reveal reveal-delay-1">

          {/* Left: heading + quick links */}
          <div className="contact-heading-col">
            <p className="contact-invite">
              Always interested in discussing new opportunities, collaborating on interesting
              projects, or just having a chat about technology and innovation.
            </p>

            <div className="contact-links">
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

          {/* Right: contact form */}
          <div className="contact-form-col">
            <h3 className="contact-form-title">Send a message</h3>
            <form onSubmit={handleSubmit} className="contact-form-stack">
              <input
                type="text"
                className="contact-field"
                placeholder="Your name"
                value={name}
                onChange={e => { setName(e.target.value); if (validationError) setValidationError('') }}
              />
              <input
                type="text"
                className="contact-field"
                placeholder="Subject"
                value={subject}
                onChange={e => { setSubject(e.target.value); if (validationError) setValidationError('') }}
              />
              <textarea
                className="contact-field"
                placeholder="Type your message here..."
                rows={6}
                value={message}
                onChange={e => { setMessage(e.target.value); if (validationError) setValidationError('') }}
                style={{ resize: 'vertical', minHeight: '130px' }}
              />
              <p className="contact-char-count">{message.length} characters</p>

              {validationError && <p className="contact-error">{validationError}</p>}
              {status === 'success' && (
                <p className="contact-success">Message sent! I&apos;ll get back to you soon.</p>
              )}
              {status === 'error' && (
                <p className="contact-error">Something went wrong — please try again or email me directly.</p>
              )}

              <button
                type="submit"
                className="btn-primary"
                disabled={status === 'sending'}
                style={{ alignSelf: 'flex-start', opacity: status === 'sending' ? 0.7 : 1 }}
              >
                {status === 'sending' ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  )
}
