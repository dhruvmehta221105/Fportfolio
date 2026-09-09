import { useEffect, useState, useCallback, useRef } from 'react';
import Lenis from 'lenis';
import AboutModal from './components/AboutModal';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import HeroSection from './components/HeroSection';
import IntroSection from './components/IntroSection';
import Navbar from './components/Navbar';
import ProjectsSection from './components/ProjectsSection';
import SkillsSection from './components/SkillsSection';
import SiteFooter from './components/SiteFooter';
import Ticker from './components/Ticker';
import { portfolioData } from './portfolioData';

const { person, navigation, skills, projects, education, research, certifications, experience, contact } = portfolioData;

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const scrollRafRef = useRef<number | null>(null);
  const sectionsCacheRef = useRef<{ id: string; top: number; bottom: number }[]>([]);

  // Optimized mouse glow position without forced getBoundingClientRect layout thrashing
  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showAboutModal ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [showAboutModal]);

  // Silky smooth Lenis configuration
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
      wheelMultiplier: 1,
      lerp: 0.1,
    });

    let animationFrame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      animationFrame = requestAnimationFrame(raf);
    };

    animationFrame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(animationFrame);
      lenis.destroy();
    };
  }, []);

  // Cache section positions and throttle active section detection
  useEffect(() => {
    const updateSectionCache = () => {
      const sections = Array.from(document.querySelectorAll('section[id]')) as HTMLElement[];
      const scrollY = window.scrollY;
      sectionsCacheRef.current = sections.map((sec) => {
        const rect = sec.getBoundingClientRect();
        const top = rect.top + scrollY;
        return {
          id: sec.id,
          top,
          bottom: top + rect.height,
        };
      });
    };

    updateSectionCache();
    window.addEventListener('resize', updateSectionCache, { passive: true });

    const handleScroll = () => {
      if (scrollRafRef.current !== null) return;

      scrollRafRef.current = requestAnimationFrame(() => {
        scrollRafRef.current = null;
        const scrollPosition = window.scrollY + 140;
        const sections = sectionsCacheRef.current;

        for (let i = 0; i < sections.length; i++) {
          const { id, top, bottom } = sections[i];
          if (scrollPosition >= top && scrollPosition < bottom) {
            setActiveSection(id);
            break;
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', updateSectionCache);
      window.removeEventListener('scroll', handleScroll);
      if (scrollRafRef.current !== null) cancelAnimationFrame(scrollRafRef.current);
    };
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offsetPosition = element.getBoundingClientRect().top - document.body.getBoundingClientRect().top - 80;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        person={person}
        navigation={navigation}
        activeSection={activeSection}
        mobileMenuOpen={mobileMenuOpen}
        onScrollTo={scrollTo}
        onToggleMobileMenu={() => setMobileMenuOpen((open) => !open)}
      />
      <HeroSection person={person} onScrollTo={scrollTo} />
      <Ticker person={person} />
      <IntroSection person={person} skills={skills} onOpenAbout={() => setShowAboutModal(true)} />
      <ProjectsSection
        projects={projects}
        activeProjectIndex={activeProjectIndex}
        onProjectChange={setActiveProjectIndex}
        onMouseMove={handleMouseMove}
      />
      <SkillsSection />
      <AboutSection
        education={education}
        research={research}
        certifications={certifications}
        experience={experience}
        onMouseMove={handleMouseMove}
      />
      <ContactSection contact={contact} />
      <SiteFooter
        person={person}
        contact={contact}
        onScrollTo={scrollTo}
        onOpenAbout={() => setShowAboutModal(true)}
      />
      <AboutModal person={person} open={showAboutModal} onClose={() => setShowAboutModal(false)} />
    </div>
  );
}
