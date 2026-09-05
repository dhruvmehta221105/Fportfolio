import { Award, Briefcase, GraduationCap } from 'lucide-react';
import ScrollStack, { ScrollStackItem } from './ScrollStack';
import type { portfolioData } from '../portfolioData';

type AboutSectionProps = {
  education: typeof portfolioData.education;
  certifications: typeof portfolioData.certifications;
  experience: typeof portfolioData.experience;
  onMouseMove: React.MouseEventHandler<HTMLDivElement>;
};

export default function AboutSection({ education, certifications, experience, onMouseMove }: AboutSectionProps) {
  return (
    <section id="about" className="section section-dark">
      <div className="container">
        <div className="section-header"><h2 className="section-title">Education & <span>Experience</span></h2><div className="section-line"></div></div>
        <ScrollStack useWindowScroll={true} itemStackDistance={24} itemScale={0.02} itemDistance={100} stackPosition="15%" baseScale={0.92}>
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
              <h3 className="education-title" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '22px' }}><Award size={26} /> Certifications</h3>
              <ul className="timeline-desc" style={{ paddingLeft: '0', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>{certifications.map((certification) => <li key={certification} className="timeline-bullet" style={{ fontSize: '14px', lineHeight: '1.6' }}>{certification}</li>)}</ul>
            </div>
          </ScrollStackItem>

          <ScrollStackItem itemClassName="glow-card experience-card-stack" onMouseMove={onMouseMove}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 className="education-title" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '22px', marginBottom: '8px' }}><Briefcase size={24} /> Experience</h3>
              <div className="timeline">{experience.map((job, index) => <div key={`${job.company}-${job.role}`} className="timeline-item" style={{ marginBottom: index === experience.length - 1 ? '0' : '28px' }}><div className="timeline-dot"></div><div className="timeline-header"><h3 className="timeline-role" style={{ fontSize: '18px' }}>{job.role}</h3><span className="timeline-date">{job.date}</span></div><p className="timeline-company" style={{ fontSize: '13px' }}>{job.company}</p><ul className="timeline-desc" style={{ marginTop: '12px' }}>{job.bullets.map((bullet, bulletIndex) => <li key={bullet} className="timeline-bullet" style={{ fontSize: '13.5px', marginBottom: bulletIndex === job.bullets.length - 1 ? '0px' : '8px' }}>{bullet}</li>)}</ul></div>)}</div>
            </div>
          </ScrollStackItem>
        </ScrollStack>
      </div>
    </section>
  );
}
