import { Github, Linkedin, Mail, Phone } from 'lucide-react';
import { useRef } from 'react';
import VariableProximity from './VariableProximity';
import DotField from './DotField';
import type { portfolioData } from '../portfolioData';

type ContactSectionProps = { contact: typeof portfolioData.contact };

export default function ContactSection({ contact }: ContactSectionProps) {
  const contactContainerRef = useRef<HTMLDivElement>(null);

  return (
    <section id="contact" className="section" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.85 }}><DotField dotRadius={2.2} dotSpacing={14} bulgeStrength={60} glowRadius={180} sparkle={false} waveAmplitude={0.4} gradientFrom="rgba(11, 11, 12, 0.35)" gradientTo="rgba(11, 11, 12, 0.20)" glowColor="rgba(0, 0, 0, 0.04)" /></div>
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="section-header" ref={contactContainerRef} style={{ justifyContent: 'center', flexDirection: 'column', gap: '12px' }}>
          <h2 className="section-title contact-section-title" style={{ display: 'inline-block', textAlign: 'center', margin: '0 auto' }}><VariableProximity label="Let's Connect" fromFontVariationSettings="'wght' 400, 'opsz' 9" toFontVariationSettings="'wght' 900, 'opsz' 40" containerRef={contactContainerRef} radius={120} falloff="linear" /></h2>
          <div className="section-line" style={{ flexGrow: 0, width: '80px', height: '2px', backgroundColor: 'var(--accent-light, #10b981)', margin: '0 auto' }}></div>
        </div>
        <div className="contact-container">
          <p className="contact-text">{contact.message}</p>
          <div className="contact-links"><a href={`mailto:${contact.email}`} className="btn-primary" style={{ gap: '8px' }}><Mail size={16} /> {contact.email}</a><a href={contact.phoneHref} className="btn-secondary" style={{ gap: '8px' }}><Phone size={16} /> {contact.phone}</a></div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '48px' }}><a href={contact.github} target="_blank" rel="noreferrer" className="outline-icon-button" aria-label="GitHub"><Github size={20} /></a><a href={contact.linkedin} target="_blank" rel="noreferrer" className="outline-icon-button" aria-label="LinkedIn"><Linkedin size={20} /></a></div>
        </div>
      </div>
    </section>
  );
}
