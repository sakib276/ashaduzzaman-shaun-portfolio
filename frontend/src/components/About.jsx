import React from 'react';

export default function About({ profile, contact }) {
  return (
    <section id="about" className="section">
      <div className="container">
        <div className="section-heading">
          <span>ABOUT ME</span>
          <h2>Get to know me</h2>
        </div>

        <div className="about-grid">
          <div className="about-text">
            <p id="about-text">{profile.about}</p>
          </div>

          <div className="about-details">
            <div className="detail-item">
              <span>Location</span>
              <strong id="location">{profile.location}</strong>
            </div>

            <div className="detail-item">
              <span>Focus</span>
              <strong id="focus">{profile.focus}</strong>
            </div>

            <div className="detail-item">
              <span>Email</span>
              <strong id="email">{contact.email}</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
