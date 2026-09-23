import React from 'react';

export default function Contact({ contact }) {
  const whatsappDigits = contact.whatsapp ? contact.whatsapp.replace(/[^0-9]/g, '') : '';

  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <div className="section-heading">
          <span>CONTACT</span>
          <h2>Let's connect & collaborate</h2>
        </div>

        <div className="contact-card">
          <p>
            Interested in collaboration, career opportunities, or business discussions?
            Feel free to reach out directly via Email, WhatsApp, or Instagram!
          </p>

          <div className="contact-action-group" style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center', marginTop: '25px' }}>
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                id="contact-email"
                className="primary-btn"
              >
                ✉️ Send Email
              </a>
            )}

            {contact.whatsapp && (
              <a
                href={`https://wa.me/${whatsappDigits}`}
                target="_blank"
                rel="noreferrer"
                className="secondary-btn"
                style={{ borderColor: '#25D366', color: '#25D366' }}
              >
                💬 WhatsApp
              </a>
            )}

            {contact.instagram && (
              <a
                href={contact.instagram}
                target="_blank"
                rel="noreferrer"
                className="secondary-btn"
                style={{ borderColor: '#E1306C', color: '#f09433' }}
              >
                📸 Instagram
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
