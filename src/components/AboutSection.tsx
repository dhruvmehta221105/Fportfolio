import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Award, BriefcaseBusiness, ExternalLink, GraduationCap, ShieldCheck } from 'lucide-react';
import type { portfolioData } from '../portfolioData';

type AboutSectionProps = {
  education: typeof portfolioData.education;
  research: typeof portfolioData.research;
  certifications: typeof portfolioData.certifications;
  experience: typeof portfolioData.experience;
  onMouseMove: React.MouseEventHandler<HTMLDivElement>;
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

export default function AboutSection({
  education,
  research,
  certifications,
  experience,
  onMouseMove
}: AboutSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const carouselViewportRef = useRef<HTMLDivElement>(null);
  const carouselTrackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [maxCarouselShift, setMaxCarouselShift] = useState(0);

  useEffect(() => {
    let frame = 0;

    const updateProgress = () => {
      frame = 0;
      const section = sectionRef.current;
      if (!section) return;

      const scrollableDistance = Math.max(1, section.offsetHeight - window.innerHeight);
      setProgress(clamp((window.scrollY - section.offsetTop) / scrollableDistance, 0, 1));
    };

    const handleScroll = () => {
      if (!frame) frame = requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateProgress);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const viewport = carouselViewportRef.current;
    const track = carouselTrackRef.current;
    if (!viewport || !track) return;

    const updateCarouselWidth = () => {
      setMaxCarouselShift(Math.max(0, track.scrollWidth - viewport.clientWidth));
    };

    const resizeObserver = new ResizeObserver(updateCarouselWidth);
    resizeObserver.observe(viewport);
    resizeObserver.observe(track);
    updateCarouselWidth();

    return () => resizeObserver.disconnect();
  }, []);

  const wipeProgress = clamp(progress / 0.28, 0, 1);
  const carouselProgress = clamp((progress - 0.28) / 0.72, 0, 1);
  const cards = [
    {
      id: 'education',
      title: 'Education',
      icon: <GraduationCap size={26} aria-hidden="true" />,
      content: (
        <>
          <p className="about-showcase-eyebrow">{education.status}</p>
          <h3>{education.degree}</h3>
          <p className="about-showcase-meta">{education.graduation}</p>
        </>
      )
    },
    {
      id: 'research',
      title: 'Research & Recognition',
      icon: <Award size={26} aria-hidden="true" />,
      content: (
        <>
          <p className="about-showcase-eyebrow">{research.venue}</p>
          <h3>{research.title}</h3>
          <p>{research.description}</p>
          <p>{research.recognition}</p>
          <a className="research-publication-link" href={research.url} target="_blank" rel="noreferrer">
            Open publication <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </>
      )
    },
    {
      id: 'experience',
      title: 'Experience',
      icon: <BriefcaseBusiness size={26} aria-hidden="true" />,
      content: (
        <div className="about-showcase-experience-list">
          {experience.map((item) => (
            <article key={`${item.role}-${item.company}`} className="about-showcase-experience">
              <div>
                <h3>{item.role}</h3>
                <p className="about-showcase-meta">
                  {item.company}{item.employmentType ? ` - ${item.employmentType}` : ''}
                </p>
              </div>
              <p className="about-showcase-date">{item.date}</p>
              {item.location && <p className="about-showcase-meta">{item.location}</p>}
              {item.description && <p>{item.description}</p>}
              {item.bullets.map((bullet) => <p key={bullet}>{bullet}</p>)}
            </article>
          ))}
        </div>
      )
    },
    {
      id: 'certifications',
      title: 'Certifications',
      icon: <ShieldCheck size={26} aria-hidden="true" />,
      content: (
        <div className="about-showcase-certifications">
          {certifications.length > 0 ? certifications.map((certification) => (
            <article key={`${certification.name}-${certification.issuer}`}>
              <h3>{certification.name}</h3>
              <p className="about-showcase-meta">{certification.issuer} | {certification.date}</p>
              <p>Credential ID {certification.credentialId}</p>
              <a className="certification-link" href={certification.url} target="_blank" rel="noreferrer">
                Show credential <ExternalLink size={14} aria-hidden="true" />
              </a>
            </article>
          )) : <p>No certifications added yet.</p>}
        </div>
      )
    }
  ];
  return (
    <section ref={sectionRef} id="about" className="about-showcase-section">
      <div className="about-showcase-sticky">
        <div className="about-showcase-wipe" style={{ transform: `translateX(${-wipeProgress * 100}%)` }} />
        <div className="container about-showcase-container">
          <div className="about-showcase-header">
            <p className="section-kicker">The path so far</p>
            <h2 className="section-title">Education <span>&amp; Experience</span></h2>
            <p className="about-showcase-instruction">Keep scrolling to move through the story.</p>
          </div>

          <div ref={carouselViewportRef} className="about-showcase-cards">
            <div
              ref={carouselTrackRef}
              className="about-showcase-track"
              style={{ transform: `translate3d(${-carouselProgress * maxCarouselShift}px, 0, 0)` }}
            >
              {cards.map((card, index) => (
                <article key={card.id} className="about-showcase-slide" onMouseMove={onMouseMove}>
                  <div className="about-showcase-card glow-card">
                    <div className="about-showcase-card-title">
                      <span className="about-showcase-icon">{card.icon}</span>
                      <h3>{card.title}</h3>
                      <span className="about-showcase-counter">0{index + 1} / 0{cards.length}</span>
                    </div>
                    <div className="about-showcase-card-content">{card.content}</div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
        <div className="about-showcase-progress" style={{ transform: `scaleX(${progress})` }} />
      </div>
    </section>
  );
}
