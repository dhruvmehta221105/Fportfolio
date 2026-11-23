import DotField from './DotField';
import ParticleText from './ParticleText';
import SkillsMarquee from './SkillsMarquee';

export default function SkillsSection() {
  return (
    <section id="skills" className="section" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.85 }}>
        <DotField
          dotRadius={2.2}
          dotSpacing={14}
          bulgeStrength={60}
          glowRadius={180}
          sparkle={false}
          waveAmplitude={0.4}
          gradientFrom="rgba(11, 11, 12, 0.35)"
          gradientTo="rgba(11, 11, 12, 0.20)"
          glowColor="rgba(0, 0, 0, 0.04)"
        />
      </div>
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="skills-title-wrapper">
          <ParticleText
            text="TECHNICAL SKILLS"
            particleSize={2.2}
            density={4}
            color="#050505"
            highlightColor="#12452f"
            scatter={190}
            gatherDuration={1600}
            clickBurst
            burstStrength={1}
            pointerRepel={42}
            repelRadius={120}
            idleDrift={0.8}
            fontSize="clamp(3.5rem, 13vw, 9rem)"
            fontWeight={800}
            fontFamily="inherit"
          />
        </div>
        <SkillsMarquee />
      </div>
    </section>
  );
}

