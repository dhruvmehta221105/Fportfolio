import React from 'react';
import type { portfolioData } from '../portfolioData';
import { ArrowUpRight } from 'lucide-react';

type SiteFooterProps = {
  person: typeof portfolioData.person;
  contact: typeof portfolioData.contact;
  onScrollTo?: (id: string) => void;
  onOpenAbout?: () => void;
};

export default function SiteFooter({
  person,
  contact,
  onScrollTo,
  onOpenAbout,
}: SiteFooterProps) {
  const currentYear = new Date().getFullYear();

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    e.preventDefault();
    if (onScrollTo) {
      onScrollTo(sectionId);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleAboutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onOpenAbout) {
      onOpenAbout();
    } else if (onScrollTo) {
      onScrollTo('about');
    }
  };

  return (
    <footer className="modern-footer">
      <div className="modern-footer-inner">
        {/* Top Section */}
        <div className="modern-footer-top">
          {/* Left Columns - Navigation & Social Links */}
          <div className="modern-footer-links-group">
            {/* Column 1: Internal navigation links */}
            <div className="modern-footer-col">
              <h4 className="modern-footer-heading">Links</h4>
              <ul className="modern-footer-list">
                <li>
                  <a
                    href="#projects"
                    onClick={(e) => handleNavClick(e, 'projects')}
                  >
                    Work
                  </a>
                </li>
                <li>
                  <a
                    href="#projects"
                    onClick={(e) => handleNavClick(e, 'projects')}
                  >
                    Cases
                  </a>
                </li>
                <li>
                  <a
                    href="#skills"
                    onClick={(e) => handleNavClick(e, 'skills')}
                  >
                    Skills
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    onClick={(e) => handleNavClick(e, 'about')}
                  >
                    Experience
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    onClick={(e) => handleNavClick(e, 'about')}
                  >
                    Education
                  </a>
                </li>
                <li>
                  <a href="#about" onClick={handleAboutClick}>
                    About Me
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 2: External / Social links */}
            <div className="modern-footer-col">
              <h4 className="modern-footer-heading">© LINKS º</h4>
              <ul className="modern-footer-list">
                <li>
                  <a
                    href={contact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Github
                  </a>
                </li>
                <li>
                  <a
                    href={contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Linkedin
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${contact.email}`}
                  >
                    Email
                  </a>
                </li>
                <li>
                  <a
                    href={person.resume.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Resume
                  </a>
                </li>
                <li>
                  <a
                    href={contact.phoneHref}
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Section - CTA */}
          <div className="modern-footer-cta">
            <h2 className="modern-footer-cta-title">
              Let&apos;s build together. Waiting to connect.
            </h2>
            <div className="modern-footer-cta-action">
              <a
                href={`mailto:${contact.email}?subject=Let's%20Connect%20-%20Project%20Inquiry`}
                className="modern-footer-book-call"
              >
                <span>Book A Call</span>
                <ArrowUpRight size={18} className="cta-icon" />
              </a>
            </div>
          </div>
        </div>

        {/* Center / Bottom Big Brand Typography */}
        <div className="modern-footer-brand-container">
          <div className="modern-footer-brand-backdrop-circle" aria-hidden="true" />
          <h1 className="modern-footer-big-name" aria-label="Dhruv">
            DHRUV<span className="brand-dot">•</span>
          </h1>
        </div>

        {/* Bottom Bar */}
        <div className="modern-footer-bottom">
          <div className="modern-footer-copyright">
            &copy;{currentYear}
          </div>
          <div className="modern-footer-credit">
            {person.name} &middot; Software Developer
          </div>
        </div>
      </div>
    </footer>
  );
}
