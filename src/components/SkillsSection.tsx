import DotField from './DotField';
import SkillsMarquee from './SkillsMarquee';
import TextPressure from './TextPressure';

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
          <TextPressure
            text="TECHNICAL SKILLS"
            flex={true}
            alpha={false}
            stroke={false}
            width={true}
            weight={true}
            italic={true}
            textColor="var(--foreground)"
            minFontSize={28}
          />
        </div>
        <SkillsMarquee />
      </div>
    </section>
  );
}

