import type { portfolioData } from '../portfolioData';

type ProjectsSectionProps = {
  projects: typeof portfolioData.projects;
  onMouseMove?: React.MouseEventHandler<HTMLDivElement>;
  activeProjectIndex?: number;
  onProjectChange?: (index: number) => void;
};

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  if (!projects.length) return null;

  return (
    <section id="projects" className="projects-list-section">
      <div className="projects-list-container">
        <header className="projects-list-header">
          <div>
            <p className="projects-list-label">Selected work</p>
            <h2>Projects</h2>
          </div>
          <p className="projects-list-intro">A selection of things I have designed and built.</p>
        </header>

        <div className="projects-list">
          {projects.map((project, index) => (
            <article className="project-list-item" key={project.id}>
              <div className="project-list-media">
                <span className="project-list-fallback">Preview unavailable</span>
                <img
                  src={project.image}
                  alt={`${project.shortTitle} project preview`}
                  onError={(event) => { event.currentTarget.style.display = 'none'; }}
                />
              </div>

              <div className="project-list-content">
                <div className="project-list-heading">
                  <span className="project-list-number">{String(index + 1).padStart(2, '0')}</span>
                  <h3>{project.title}</h3>
                </div>
                <p className="project-list-description">{project.description}</p>
                <div className="project-list-tags">
                  {project.tech.map((tag) => (
                    <span key={tag} className="project-list-tag">{tag}</span>
                  ))}
                </div>
                <ul className="project-list-highlights">
                  {project.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <a href={project.github} target="_blank" rel="noreferrer" className="project-list-link">
                  View project <span aria-hidden="true">-&gt;</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}