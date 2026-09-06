import DotField from './DotField';
import type { portfolioData } from '../portfolioData';

type Person = typeof portfolioData.person;

type HeroSectionProps = {
  person: Person;
  onScrollTo: (id: string) => void;
};

export default function HeroSection({
  person,
  onScrollTo,
}: HeroSectionProps) {
  return (
    <section
      id="home"
      className="hero-section"
      style={{
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          opacity: 0.85,
        }}
      >
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

      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div className="hero-content-centered">

          {/* Greeting */}
          <div
            className="hero-subtitle-centered"
            style={{
              textTransform: 'capitalize',
            }}
          >
            <span>{person.greeting}</span>
          </div>

          {/* Main Hero Content */}
          <div className="hero-stack-container">

            <h1 className="hero-text-row text-solid">
              {person.headline[0]}
            </h1>

            <div className="hero-avatar-wrapper">
              <img
                src={person.avatar}
                alt={person.name}
                className="hero-avatar-img"
                onError={(event) => {
                  event.currentTarget.src = person.fallbackAvatar;
                }}
              />
            </div>

            <h1 className="hero-text-row text-solid">
              {person.headline[1]}
            </h1>

            <h1 className="hero-text-row text-solid">
              {person.headline[2]}
            </h1>

          </div>

          {/* Location & Specialties */}
          <div className="hero-details-row">

            <div className="hero-details-location">
              {person.location}
            </div>

            <div className="hero-details-logos">
              {person.specialties.map((specialty, index) => (
                <span
                  key={specialty}
                  className="tech-logo"
                >
                  {index > 0 && (
                    <span className="tech-logo-dot">
                      &bull;
                    </span>
                  )}{' '}
                  {specialty}
                </span>
              ))}
            </div>

          </div>

          {/* Buttons */}
          <div className="hero-actions-centered">

            <button
              onClick={() => onScrollTo('projects')}
              className="btn-primary-pill"
            >
              See my work
            </button>

            <button
              onClick={() => onScrollTo('contact')}
              className="btn-secondary-pill"
            >
              Let's Connect
            </button>

          </div>

        </div>
      </div>
    </section>
  );
}