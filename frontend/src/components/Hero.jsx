import React from 'react';

export default function Hero({ profile, contact }) {
  // Render bio sentences with interactive hover effect
  const renderBioWithHover = (bioText) => {
    if (!bioText) return null;
    const sentences = bioText.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g);
    if (!sentences || sentences.length <= 1) {
      return <span className="hoverable-sentence">{bioText}</span>;
    }
    return sentences.map((sentence, idx) => (
      <span key={idx} className="hoverable-sentence">
        {sentence}{' '}
      </span>
    ));
  };

  return (
    <section id="home" className="hero">
      <div className="container hero-container">
        <div className="hero-content">
          <span className="badge">✨ WELCOME TO MY PORTFOLIO</span>

          <h1>
            Hi, I'm <span id="hero-name">{profile.name}</span>
          </h1>

          <p id="hero-bio">{renderBioWithHover(profile.bio)}</p>

          <div className="hero-buttons">
            <a href="#contact" className="primary-btn">
              Get In Touch <span>→</span>
            </a>

            <a
              href={profile.cvUrl || "/Shaun_CV.pdf"}
              download="Ashaduzzaman_Shaun_CV.pdf"
              className="primary-btn cv-download-btn"
              title="Download Shaun's Curriculum Vitae"
            >
              <span>📥</span> Download CV
            </a>

            <a href="#experience" className="secondary-btn">
              Experience
            </a>
          </div>

          <div className="social-links">
            <span className="connect-text">CONNECT</span>

            {contact.instagram && (
              <a
                href={contact.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="social-btn instagram-btn"
              >
                Instagram
              </a>
            )}

            {contact.whatsapp && (
              <a
                href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="social-btn whatsapp-btn"
              >
                WhatsApp
              </a>
            )}

            {contact.linkedin && (
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="social-btn linkedin-btn"
              >
                LinkedIn
              </a>
            )}

            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                aria-label="Email"
                className="social-btn email-btn"
              >
                Email
              </a>
            )}
          </div>
        </div>

        {/* HERO IMAGE */}
        <div className="hero-image">
          <div className="profile-circle">
            {profile.image ? (
              <img
                src={profile.image}
                alt={`${profile.name} profile`}
                id="profile-image"
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #0f2d27 0%, #174239 100%)',
                  color: '#69d6c6'
                }}
              >
                <svg
                  width="120"
                  height="120"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
            )}
          </div>

          <div className="experience-card">
            <strong id="experience-years">{profile.experienceYears}</strong>
            <span>
              Years<br />Experience
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
