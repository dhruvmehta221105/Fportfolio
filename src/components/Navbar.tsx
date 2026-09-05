import { Menu, X } from 'lucide-react';
import type { portfolioData } from '../portfolioData';

type Portfolio = typeof portfolioData;

type NavbarProps = {
  person: Portfolio['person'];
  navigation: Portfolio['navigation'];
  activeSection: string;
  mobileMenuOpen: boolean;
  onScrollTo: (id: string) => void;
  onToggleMobileMenu: () => void;
};

export default function Navbar({ person, navigation, activeSection, mobileMenuOpen, onScrollTo, onToggleMobileMenu }: NavbarProps) {
  const links = navigation.items.map((item) => ({ item, label: item === 'about' ? navigation.aboutLabel : item }));

  return (
    <>
      <header className="header">
        <div className="container header-container">
          <div
            onClick={() => onScrollTo('home')}
            className="logo"
            style={{ cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <span style={{ fontWeight: 300, fontSize: '18px' }}>&larr;</span> {person.logoName}<span>.</span>
          </div>

          <nav className="nav-links">
            {links.map(({ item, label }) => (
              <a key={item} href={`#${item}`} onClick={(event) => { event.preventDefault(); onScrollTo(item); }} className={`nav-link ${activeSection === item ? 'active' : ''}`} style={{ textTransform: 'capitalize' }}>
                {label}
              </a>
            ))}
            <a href={person.resume.url} download={person.resume.filename} className="btn-header-email">Download Resume</a>
          </nav>

          <button className="mobile-menu-btn" onClick={onToggleMobileMenu} aria-label="Toggle menu">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <nav className="mobile-nav">
          {links.map(({ item, label }) => (
            <a key={item} href={`#${item}`} onClick={(event) => { event.preventDefault(); onScrollTo(item); }} className={`nav-link ${activeSection === item ? 'active' : ''}`} style={{ textTransform: 'capitalize', padding: '8px 0', fontSize: '16px' }}>
              {label}
            </a>
          ))}
          <a href={person.resume.url} download={person.resume.filename} className="btn-primary" style={{ width: '100%', marginTop: '8px', fontSize: '12px', textAlign: 'center' }}>
            Download Resume
          </a>
        </nav>
      )}
    </>
  );
}
