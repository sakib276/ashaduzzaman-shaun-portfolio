import React from 'react';

export default function Achievements({ achievements = [] }) {
  if (!achievements || achievements.length === 0) return null;

  return (
    <section id="achievements" className="section achievements-section">
      <div className="container">
        <div className="section-heading">
          <span>ACHIEVEMENTS</span>
          <h2>Milestones & Recognition</h2>
        </div>

        <div className="achievements-grid">
          {achievements.map((item, index) => (
            <article key={item.id || index} className="achievement-card">
              <div className="achievement-header">
                <span className="achievement-badge">{item.badge || 'Milestone'}</span>
                <span className="achievement-year">{item.year}</span>
              </div>
              <h3 className="achievement-title">{item.title}</h3>
              <p className="achievement-description">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
