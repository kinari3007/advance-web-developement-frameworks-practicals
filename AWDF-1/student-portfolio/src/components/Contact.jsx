export default function Contact() {
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