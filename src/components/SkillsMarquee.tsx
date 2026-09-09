import React from 'react';
import './SkillsMarquee.css';

interface SkillRow {
  id: string;
  direction: 'left' | 'right';
  speed: number; // in seconds
  items: string[];
}

const SKILL_ROWS: SkillRow[] = [
  {
    id: 'row-1',
    direction: 'left',
    speed: 38,
    items: [
      'JavaScript',
      'TypeScript',
      'React',
      'React Native',
      'Next.js',
      'TailwindCSS',
      'HTML5',
      'CSS3',
      'Redux Toolkit',
      'Framer Motion',
      'Vite',
      'Figma',
      'UI/UX Design',
    ],
  },
  {
    id: 'row-2',
    direction: 'right',
    speed: 42,
    items: [
      'PyTorch',
      'TensorFlow',
      'scikit-learn',
      'NumPy',
      'Pandas',
      'SciPy',
      'Matplotlib',
      'OpenAI API',
      'Groq',
      'LangChain',
      'Whisper',
      'LLM Integration',
      'Prompt Engineering',
    ],
  },
  {
    id: 'row-3',
    direction: 'left',
    speed: 36,
    items: [
      'Node.js',
      'Express.js',
      'Python',
      'FastAPI',
      'PostgreSQL',
      'MongoDB',
      'SQL',
      'REST APIs',
      'Firebase',
      'Docker',
      'Git',
      'GitHub',
      'Gunicorn',
      'Postman',
      'Render',
      'Vercel',
    ],
  },
];

export default function SkillsMarquee() {
  return (
    <div className="skills-index-wrapper">
      <p className="skills-index-caption">
        Dynamic horizontal index of tools, packages, and frameworks. Hover to pause the scroll and inspect.
      </p>

      <div className="skills-marquee-board" aria-label="Technical skills interactive index">
        {SKILL_ROWS.map((row) => (
          <div
            key={row.id}
            className="skills-marquee-row"
            style={{ '--speed': `${row.speed}s` } as React.CSSProperties}
          >
            {/* We render 2 identical tracks per row to produce a seamless 100% loop */}
            {[0, 1].map((copyIndex) => (
              <div
                key={copyIndex}
                className={`skills-marquee-track ${
                  row.direction === 'left' ? 'scroll-left' : 'scroll-right'
                }`}
                aria-hidden={copyIndex > 0 ? true : undefined}
              >
                {row.items.map((skill, itemIndex) => (
                  <span
                    key={`${skill}-${itemIndex}`}
                    className="skills-marquee-item"
                    title={`Technology: ${skill}`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
