import React, { useState, useEffect, useRef } from 'react';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'about', label: 'About', icon: '👤' },
  { id: 'experience', label: 'Experience', icon: '💼' },
  { id: 'achievements', label: 'Achievements', icon: '🏆' },
  { id: 'projects', label: 'Projects', icon: '🚀' },
  { id: 'education', label: 'Education', icon: '🎓' },
  { id: 'contact', label: 'Contact', icon: '✉️' },
];

export default function Navbar({
  currentView,
  onToggleView,
  logoName = "Portfolio",
  profile = {},
  contact = {}
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [copied, setCopied] = useState(false);
  const islandRef = useRef(null);

  // Scroll listener for compacting island & detecting active section
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      // Section tracking for scroll spy
      const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(Boolean);
      const scrollPosition = window.scrollY + 160;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close island on click outside or Escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (islandRef.current && !islandRef.current.contains(e.target)) {
        setIsExpanded(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isExpanded]);

  const handleNavClick = (e, targetId) => {
    if (e) e.preventDefault();
    if (currentView !== 'portfolio') {
      onToggleView('portfolio');
    }
    setIsExpanded(false);

    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      const navOffset = 90;
      const elementPosition = targetEl.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(targetId.replace('#', ''));
    }
  };

  const handleCopyEmail = (e) => {
    e.stopPropagation();
    const emailToCopy = contact.email || 'hello@developer.com';
    navigator.clipboard?.writeText(emailToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }).catch(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  };

  const toggleIsland = (e) => {
    e.stopPropagation();
    setIsExpanded((prev) => !prev);
  };

  return (
    <header className="dynamic-island-wrapper">
      <div
        ref={islandRef}
        className={`dynamic-island ${isExpanded ? 'island-expanded' : ''} ${
          isScrolled ? 'island-scrolled' : ''
        }`}
        role="navigation"
        aria-label="Dynamic Island Navigation"
      >
        {/* COMPACT / DEFAULT ISLAND BAR */}
        <div className="island-bar">
          {/* Left: Sensor & Brand Cutout */}
          <div
            className="island-brand-cutout"
            onClick={toggleIsland}
            title="Click to toggle Dynamic Island Live Activity"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') toggleIsland(e);
            }}
          >
            <div className="island-camera-pill">
              <span className="live-dot" />
              <span className="camera-lens" />
            </div>
            <a
              href="#home"
              className="island-logo"
              onClick={(e) => handleNavClick(e, '#home')}
            >
              {logoName}
            </a>
            <span className="island-live-badge">Available</span>
          </div>

          {/* Center: Dynamic Nav Links (Desktop) */}
          <nav className="island-nav-menu">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`island-nav-link ${isActive ? 'active' : ''}`}
                  onClick={(e) => handleNavClick(e, `#${item.id}`)}
                >
                  {item.label}
                  {isActive && <span className="active-pill-glow" />}
                </a>
              );
            })}
          </nav>

          {/* Right: Actions & Island Expander */}
          <div className="island-actions">
            <a
              href="#contact"
              className="island-hire-btn"
              onClick={(e) => handleNavClick(e, '#contact')}
            >
              Hire Me
            </a>

            {/* Island Expansion Trigger (Chevron / Toggle) */}
            <button
              type="button"
              className={`island-expand-trigger ${isExpanded ? 'active' : ''}`}
              onClick={toggleIsland}
              aria-expanded={isExpanded}
              aria-label="Toggle Dynamic Island Details"
              title="Dynamic Island Quick Actions"
            >
              <span className="island-notch-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </span>
            </button>
          </div>
        </div>

        {/* EXPANDED ISLAND CONTENT (iOS Live Activity Card) */}
        {isExpanded && (
          <div className="island-expanded-content">
            {/* Top Cutout Bar */}
            <div className="expanded-top-bar">
              <div className="expanded-sensor-pill">
                <span className="camera-lens-mini" />
                <span className="live-dot-mini" />
                <span className="expanded-status-text">Live Activity • Open for Work</span>
              </div>
              <button
                type="button"
                className="expanded-close-btn"
                onClick={() => setIsExpanded(false)}
                aria-label="Close Dynamic Island"
              >
                ✕
              </button>
            </div>

            {/* Profile Overview Card */}
            <div className="expanded-profile-banner">
              <div className="profile-avatar-pill">
                {profile.name ? profile.name.charAt(0) : 'P'}
              </div>
              <div className="profile-info-block">
                <div className="profile-name-row">
                  <h4>{profile.name || "Portfolio"}</h4>
                  {profile.location && (
                    <span className="expanded-tag">📍 {profile.location}</span>
                  )}
                </div>
                <p className="profile-focus-text">
                  {profile.focus || profile.bio || "Full-Stack Developer & Designer"}
                </p>
              </div>
            </div>

            {/* Quick Navigation Capsule Grid */}
            <div className="expanded-nav-grid">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`expanded-nav-capsule ${
                    activeSection === item.id ? 'active' : ''
                  }`}
                  onClick={(e) => handleNavClick(e, `#${item.id}`)}
                >
                  <span className="capsule-icon">{item.icon}</span>
                  <span className="capsule-label">{item.label}</span>
                </a>
              ))}
            </div>

            {/* Quick Actions Footer */}
            <div className="expanded-footer-actions">
              <a
                href={profile.cvUrl || "/Shaun_CV.pdf"}
                download="Ashaduzzaman_Shaun_CV.pdf"
                className="expanded-action-btn cv-nav-btn"
                style={{ textDecoration: 'none' }}
              >
                <span>📥 Download CV</span>
              </a>

              <button
                type="button"
                className="expanded-action-btn email-copy-btn"
                onClick={handleCopyEmail}
              >
                <span>{copied ? '✓ Copied!' : '📋 Copy Email'}</span>
              </button>

              <a
                href="#contact"
                className="expanded-action-btn hire-direct-btn"
                onClick={(e) => handleNavClick(e, '#contact')}
              >
                <span>💬 Get in Touch</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
