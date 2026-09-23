import React from 'react';

export default function Projects({ projects = [] }) {
  return (
    <section id="projects" className="section projects-section">
      <div className="container">
        <div className="section-heading">
          <span>PROJECTS</span>
          <h2>Featured Work</h2>
        </div>

        <div id="projects-container" className="projects-grid">
          {projects.map((project, index) => {
            const formattedIndex = (index + 1).toString().padStart(2, '0');
            return (
              <article key={project.id || index} className="project-card">
                <div className="project-number">{formattedIndex}</div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-tech">
                  {project.technologies?.map((tech, techIdx) => (
                    <span key={techIdx}>{tech}</span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
