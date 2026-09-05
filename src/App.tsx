import { useEffect, useState } from 'react';
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

const { person, navigation, skills, projects, education, certifications, experience, contact } = portfolioData;

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);
  };

  useEffect(() => {
    document.body.style.overflow = showAboutModal ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showAboutModal]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      document.querySelectorAll('section[id]').forEach((section) => {
        const element = section as HTMLElement;
        if (scrollPosition >= element.offsetTop && scrollPosition < element.offsetTop + element.offsetHeight) {
          setActiveSection(element.id);
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
      <Navbar person={person} navigation={navigation} activeSection={activeSection} mobileMenuOpen={mobileMenuOpen} onScrollTo={scrollTo} onToggleMobileMenu={() => setMobileMenuOpen((open) => !open)} />
      <HeroSection person={person} onScrollTo={scrollTo} />
      <Ticker person={person} />
      <IntroSection person={person} skills={skills} onOpenAbout={() => setShowAboutModal(true)} />
      <ProjectsSection projects={projects} activeProjectIndex={activeProjectIndex} onProjectChange={setActiveProjectIndex} onMouseMove={handleMouseMove} />
      <SkillsSection />
      <AboutSection education={education} certifications={certifications} experience={experience} onMouseMove={handleMouseMove} />
      <ContactSection contact={contact} />
      <SiteFooter name={person.name} />
      <AboutModal person={person} open={showAboutModal} onClose={() => setShowAboutModal(false)} />
    </div>
  );
}
