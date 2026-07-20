import { useState } from 'react'
import emailjs from '@emailjs/browser'

export default function Contact() {
  const [name, setName] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [validationError, setValidationError] = useState('')

  const contactLinks = [
    {
      label: "Email",
      href: "mailto:kinarithummar@gmail.com",
      icon: "📧"
    },
    {
      label: "Phone", 
      href: "tel:+91-9106820342",
      icon: "📱"
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/kinari-thummar-97417b321/",
      icon: "💼"
    },
    {
      label: "GitHub",
      href: "https://github.com/kinari3007", 
      icon: "💻"
    }
  ]

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
        {
          name: name,
          subject: subject,
          message: message,
          time: new Date().toLocaleString()
        },
        'q-J8y3d_bkqmCE9Yb'
      )
      .then(() => {
        setStatus('success')
        setName('')
        setSubject('')
        setMessage('')
      })
      .catch((error) => {
        setStatus('error')
        console.error('EmailJS error:', error)
      })
  }

  return (
    <section id="contact" className="section">
      <div className="container">
        <div className="card">
          <span className="section-label">Get In Touch</span>
          <h2 className="section-title">Let's Connect</h2>
          
          <div className="contact-content">
            <p className="contact-invite">
              I'm always interested in discussing new opportunities, collaboration on interesting projects, 
              or just having a chat about technology and innovation. Feel free to reach out!
            </p>
            
            {/* Contact Form */}
            <div className="contact-form" style={{ marginBottom: '40px' }}>
              <h3 style={{ 
                color: 'var(--color-white)', 
                marginBottom: '20px', 
                fontSize: '20px',
                fontFamily: 'var(--font-heading)'
              }}>
                Send me a message
              </h3>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (validationError) setValidationError('')
                  }}
                  placeholder="Your name"
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid var(--color-border)',
                    background: 'rgba(59, 130, 246, 0.05)',
                    color: 'var(--color-gray-200)',
                    fontSize: '16px',
                    fontFamily: 'inherit'
                  }}
                />
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value)
                    if (validationError) setValidationError('')
                  }}
                  placeholder="Subject"
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid var(--color-border)',
                    background: 'rgba(59, 130, 246, 0.05)',
                    color: 'var(--color-gray-200)',
                    fontSize: '16px',
                    fontFamily: 'inherit'
                  }}
                />
                <textarea
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value)
                    if (validationError) setValidationError('')
                  }}
                  placeholder="Type your message here..."
                  rows={6}
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid var(--color-border)',
                    background: 'rgba(59, 130, 246, 0.05)',
                    color: 'var(--color-gray-200)',
                    fontSize: '16px',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    minHeight: '120px'
                  }}
                />
                <div style={{
                  marginTop: '8px',
                  fontSize: '14px',
                  color: 'var(--color-gray-400)',
                  textAlign: 'right'
                }}>
                  {message.length} characters
                </div>
                {validationError && (
                  <div style={{ color: '#f87171', fontSize: '14px' }}>
                    {validationError}
                  </div>
                )}
                {status === 'success' && (
                  <div style={{ color: '#4ade80', fontSize: '14px' }}>
                    Message sent! I&apos;ll get back to you soon.
                  </div>
                )}
                {status === 'error' && (
                  <div style={{ color: '#f87171', fontSize: '14px' }}>
                    Something went wrong, please try again or email me directly.
                  </div>
                )}
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  style={{
                    width: 'fit-content',
                    padding: '12px 20px',
                    borderRadius: '999px',
                    border: '1px solid var(--color-border)',
                    background: status === 'sending' ? 'rgba(59, 130, 246, 0.3)' : 'var(--color-accent)',
                    color: 'var(--color-white)',
                    fontSize: '16px',
                    fontFamily: 'inherit',
                    cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                    opacity: status === 'sending' ? 0.8 : 1
                  }}
                >
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
            
            <div className="contact-links">
              {contactLinks.map((link, index) => (
                <a
                  key={index}
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
        </div>
      </div>
    </section>
  )
}