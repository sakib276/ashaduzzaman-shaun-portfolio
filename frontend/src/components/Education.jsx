import React from 'react';

export default function Education({ education = [] }) {
  return (
    <section id="education" className="section">
      <div className="container">
        <div className="section-heading">
          <span>EDUCATION</span>
          <h2>Education</h2>
        </div>

        <div id="education-container" className="education-list">
          {education.map((item, index) => (
            <article key={item.id || index} className="education-item">
              <div className="education-year">{item.year}</div>
              <h3>{item.degree}</h3>
              <div className="education-institution">{item.institution}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
