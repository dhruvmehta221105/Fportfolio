import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import type { portfolioData } from '../portfolioData';

type ProjectsSectionProps = {
  projects: typeof portfolioData.projects;
  activeProjectIndex: number;
  onProjectChange: (index: number) => void;
  onMouseMove: React.MouseEventHandler<HTMLDivElement>;
};

export default function ProjectsSection({ projects, activeProjectIndex, onProjectChange, onMouseMove }: ProjectsSectionProps) {
  const activeProject = projects[activeProjectIndex] ?? projects[0];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') onProjectChange((activeProjectIndex - 1 + projects.length) % projects.length);
      if (event.key === 'ArrowRight') onProjectChange((activeProjectIndex + 1) % projects.length);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeProjectIndex, onProjectChange, projects.length]);

  const showPrevious = () => onProjectChange((activeProjectIndex - 1 + projects.length) % projects.length);
  const showNext = () => onProjectChange((activeProjectIndex + 1) % projects.length);

  return (
    <section id="projects" className="section section-dark">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Selected <span>Work</span></h2>
          <div className="section-line"></div>
          <span className="projects-count">{String(activeProjectIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span>
        </div>

        <div className="projects-featured-layout">
          <div className="project-visual-stage">
            <AnimatePresence mode="wait">
              {activeProject && (
                <motion.div key={activeProject.id} className="project-visual-frame" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.35 }}>
                  <img src={activeProject.image} alt={`${activeProject.shortTitle} project preview`} />
                  <div className="project-visual-overlay"></div>
                  <span className="project-visual-number">{String(activeProjectIndex + 1).padStart(2, '0')}</span>
                  <span className="project-visual-label">{activeProject.shortTitle}</span>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="project-nav-controls">
              <button type="button" onClick={showPrevious} aria-label="Show previous project" title="Previous project"><ChevronLeft size={18} /></button>
              <button type="button" onClick={showNext} aria-label="Show next project" title="Next project"><ChevronRight size={18} /></button>
            </div>
          </div>

          <div className="projects-details-column">
            <AnimatePresence mode="wait">
              {activeProject && (
                <motion.div key={activeProject.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="project-card active-details-card" onMouseMove={onMouseMove}>
                  <div>
                    <div className="project-top"><span className="project-category">{activeProject.category}</span><a href={activeProject.github} target="_blank" rel="noreferrer" className="project-link">View on GitHub <ExternalLink size={14} /></a></div>
                    <h3 className="project-title">{activeProject.title}</h3>
                    <ul className="project-bullets">{activeProject.bullets.map((bullet) => <li key={bullet} className="project-bullet">{bullet}</li>)}</ul>
                  </div>
                  <div className="project-tech">{activeProject.tech.map((tech) => <span key={tech} className="badge">{tech}</span>)}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="project-selector" aria-label="Choose a project">
          {projects.map((project, index) => (
            <button key={project.id} type="button" className={`project-selector-item ${index === activeProjectIndex ? 'active' : ''}`} onClick={() => onProjectChange(index)} aria-label={`Show ${project.shortTitle}`} aria-pressed={index === activeProjectIndex}>
              <span className="project-selector-image"><img src={project.image} alt="" /></span>
              <span className="project-selector-copy"><small>{String(index + 1).padStart(2, '0')}</small><strong>{project.shortTitle}</strong></span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
