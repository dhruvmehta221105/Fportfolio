import DotField from './DotField';
import type { portfolioData } from '../portfolioData';

type IntroSectionProps = {
  person: typeof portfolioData.person;
  skills: typeof portfolioData.skills;
  onOpenAbout: () => void;
};

export default function IntroSection({ person, skills, onOpenAbout }: IntroSectionProps) {
  return (
    <section id="intro" className="intro-section-light" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.85 }}>
        <DotField dotRadius={2.2} dotSpacing={14} bulgeStrength={60} glowRadius={180} sparkle={false} waveAmplitude={0.4} gradientFrom="rgba(11, 11, 12, 0.35)" gradientTo="rgba(11, 11, 12, 0.20)" glowColor="rgba(0, 0, 0, 0.04)" />
      </div>
      <div className="container intro-container-light" style={{ position: 'relative', zIndex: 1 }}>
        <div className="intro-content-wrapper">
          <div className="intro-left-col">
            <div className="intro-available-tag"><span className="sparkle-icon">✦</span><span className="tag-text">AVAILABLE FOR WORK</span><span className="cursor-blink">|</span></div>
            <div className="intro-title-group"><h1 className="intro-title-black">My</h1><h1 className="intro-title-gray">Expertise</h1></div>
            <p className="intro-desc">{person.intro}</p>
            <div className="intro-badges">{skills.map((skill) => <span key={skill} className="badge-light-pill">{skill}</span>)}</div>
            <div className="intro-actions"><button onClick={onOpenAbout} className="btn-solid-light">About Me</button></div>
          </div>
        </div>
      </div>
    </section>
  );
}
