import React from 'react';

export default function Experience({ experience = [] }) {
  return (
    <section id="experience" className="section experience-section">
      <div className="container">
        <div className="section-heading">
          <span>EXPERIENCE</span>
          <h2>My Experience</h2>
        </div>

        <div id="experience-container" className="experience-list">
          {experience.map((item, index) => (
            <article key={item.id || index} className="experience-item">
              <div className="experience-period">{item.period}</div>
              <h3>{item.position}</h3>
              <div className="experience-company">{item.company}</div>
              <p className="experience-description">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
