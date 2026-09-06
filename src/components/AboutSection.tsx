import { Award, ArrowUpRight, BriefcaseBusiness, ExternalLink, GraduationCap, ShieldCheck } from 'lucide-react';
import ScrollStack, { ScrollStackItem } from './ScrollStack';
import type { portfolioData } from '../portfolioData';

type AboutSectionProps = {
  education: typeof portfolioData.education;
  research: typeof portfolioData.research;
  certifications: typeof portfolioData.certifications;
  experience: typeof portfolioData.experience;
  onMouseMove: React.MouseEventHandler<HTMLDivElement>;
};

export default function AboutSection({ education, research, certifications, experience, onMouseMove }: AboutSectionProps) {
  return (
    <section id="about" className="section section-dark">
      <div className="container">
        <div className="section-header"><h2 className="section-title">Education & <span>Experience</span></h2><div className="section-line"></div></div>
        <ScrollStack useWindowScroll={true} itemStackDistance={24} itemScale={0.02} itemDistance={64} stackPosition="15%" baseScale={0.92} blurAmount={3}>
          <ScrollStackItem itemClassName="glow-card education-card-stack" onMouseMove={onMouseMove}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}><div className="education-icon" style={{ flexShrink: 0 }}><GraduationCap size={28} /></div><div><h3 className="education-title" style={{ fontSize: '24px' }}>{education.degree}</h3></div></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '20px', marginTop: '10px', flexWrap: 'wrap', gap: '12px' }}>
                <div><p style={{ color: '#94a3b8', fontFamily: 'var(--font-mono)', fontSize: '12px', textTransform: 'uppercase' }}>Status</p><p className="education-status" style={{ fontSize: '18px', fontWeight: 600, color: '#f1f5f9', marginTop: '4px' }}>{education.status}</p></div>
                <div><p style={{ color: '#94a3b8', fontFamily: 'var(--font-mono)', fontSize: '12px', textTransform: 'uppercase' }}>Graduation</p><p style={{ fontSize: '18px', fontWeight: 600, color: '#f1f5f9', marginTop: '4px' }}>{education.graduation}</p></div>
              </div>
            </div>
          </ScrollStackItem>

          <ScrollStackItem itemClassName="glow-card certifications-card-stack" onMouseMove={onMouseMove}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 className="education-title" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '22px' }}><Award size={26} /> Research & Recognition</h3>
              <p className="timeline-company" style={{ fontSize: '13px' }}>{research.venue}</p>
              <p className="timeline-desc" style={{ fontSize: '14px', lineHeight: '1.6', marginTop: '8px' }}>{research.title}</p>
              <p className="timeline-desc" style={{ fontSize: '14px', lineHeight: '1.6' }}>{research.description}</p>
              <p className="timeline-desc" style={{ fontSize: '14px', lineHeight: '1.6' }}>{research.recognition}</p>
              <a className="research-publication-link" href={research.url} target="_blank" rel="noreferrer">
                Open publication <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
          </ScrollStackItem>

          <ScrollStackItem itemClassName="glow-card experience-card-stack" onMouseMove={onMouseMove}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 className="education-title" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '22px' }}><BriefcaseBusiness size={26} /> Experience</h3>
              {experience.map((item) => (
                <div key={`${item.role}-${item.company}`} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                    <div><p className="education-title" style={{ fontSize: '18px' }}>{item.role}</p><p className="timeline-company" style={{ fontSize: '13px' }}>{item.company}{item.employmentType ? ` - ${item.employmentType}` : ''}</p></div>
                    <p className="timeline-company" style={{ fontSize: '13px' }}>{item.date}</p>
                  </div>
                  {item.location && <p className="timeline-company" style={{ fontSize: '13px' }}>{item.location}</p>}
                  {item.description && <p className="timeline-desc" style={{ fontSize: '14px', lineHeight: '1.6' }}>{item.description}</p>}
                  {item.bullets.map((bullet) => <p className="timeline-desc" key={bullet} style={{ fontSize: '14px', lineHeight: '1.6' }}>{bullet}</p>)}
                </div>
              ))}
            </div>
          </ScrollStackItem>

          <ScrollStackItem itemClassName="glow-card certifications-card-stack" onMouseMove={onMouseMove}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 className="education-title" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '22px' }}><ShieldCheck size={26} /> Certifications</h3>
              {certifications.length > 0 ? certifications.map((certification) => (
                <div key={`${certification.name}-${certification.issuer}`} className="certification-item">
                  <p className="education-title" style={{ fontSize: '18px' }}>{certification.name}</p>
                  <p className="timeline-company" style={{ fontSize: '13px' }}>{certification.issuer} | {certification.date}</p>
                  <p className="timeline-desc certification-id" style={{ fontSize: '13px', lineHeight: '1.6' }}>Credential ID {certification.credentialId}</p>
                  <a className="certification-link" href={certification.url} target="_blank" rel="noreferrer">
                    Show credential <ExternalLink size={14} aria-hidden="true" />
                  </a>
                </div>
              )) : <p className="timeline-desc" style={{ fontSize: '14px', lineHeight: '1.6' }}>Certifications will be added here as they are completed.</p>}
            </div>
          </ScrollStackItem>

        </ScrollStack>
      </div>
    </section>
  );
}
