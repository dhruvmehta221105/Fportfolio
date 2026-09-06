export type Project = {
  id: number;
  title: string;
  shortTitle: string;
  image: string;
  category: string;
  github: string;
  tech: string[];
  bullets: string[];
};

export type Experience = {
  role: string;
  date: string;
  company: string;
  employmentType?: string;
  location?: string;
  description?: string;
  bullets: string[];
};

export type Research = {
  venue: string;
  title: string;
  description: string;
  recognition: string;
  url: string;
};

export type Certification = {
  name: string;
  issuer: string;
  date: string;
  credentialId: string;
  url: string;
};

export const portfolioData = {
  person: {
    name: 'Dhruv Mehta',
    firstName: 'Dhruv',
    logoName: 'Dhruv Mehta',
    headline: ['FULL-STACK &', 'UI/UX Designer', ],
    greeting: 'Hello, my name is Dhruv and I am a',
    avatar: '/avatar.png',
    fallbackAvatar: '/avatar.jpg',
    location: 'Full-Stack Software Developer',
    specialties: ['React.js', 'Next.js', 'Node.js', 'Python', 'MongoDB'],
    intro: 'I build AI-powered web applications and scalable backend systems with a strong focus on modern frontend development, thoughtful UI/UX, and practical product experiences.',
    about: "I'm a full-stack software developer specializing in AI-powered web applications, scalable backend systems, and modern frontend development. I work with React.js, Next.js, Node.js, MongoDB, Python, and modern AI APIs, while bringing a strong interest in UI/UX design, Figma, and rapid prototyping. I enjoy turning ambitious ideas into useful, polished products.",
    availableForWork: true,
    resume: {
      url: '/dhruv-mehta-resume.pdf',
      filename: 'Dhruv_Mehta_Resume.pdf'
    }
  },
  navigation: {
    items: ['projects', 'skills', 'about', 'contact'],
    aboutLabel: 'education & experience'
  },
 skills: [
  'Python',
  'TypeScript',
  'JavaScript',
  'C++',
  'React',
  'Next.js',
  'Node.js',
  'Express.js',
  'PostgreSQL',
  'MongoDB',
  'REST APIs',
  'Git & GitHub',
  'AI/LLM Integration',
],  projects: [
    {
      id: 1,
      title: 'Kavach - AI Security Platform',
      shortTitle: 'Kavach',
      image: '/new.png',
      category: 'AI Security Platform',
      github: 'https://github.com/dhruvmehta221105/Kavach',
      tech: ['Next.js', 'React.js', 'Node.js', 'Express.js', 'MongoDB', 'Groq'],
      bullets: [
        'Developed an AI-powered security platform to detect prompt injection, jailbreak attempts, sensitive data leakage, and malicious prompts targeting large language models.',
        'Implemented prompt risk scoring and threat classification for real-time AI threat assessment.',
        'Built secure authentication, scan history, and an analytics dashboard for monitoring security findings.'
      ]
    },
    {
      id: 0,
      title: 'InterviewX - Interview Prep Platform',
      shortTitle: 'InterviewX',
      image: '/new.png',
      category: 'AI-Powered Interview Platform',
      github: 'https://github.com/dhruvmehta221105/InterviewX',
      tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'OpenAI API', 'Whisper'],
      bullets: [
        'Built an AI-powered mock interview platform using the OpenAI API to simulate technical interviews with dynamic question generation.',
        'Implemented secure authentication and interview session management for personalized practice workflows.',
        'Added transcript generation with Whisper and AI-based performance evaluation with personalized feedback.'
      ]
    }
  ] satisfies Project[],
  education: {
    degree: 'B.Tech in Computer Science and Engineering',
    status: 'Currently: 3rd Year',
    graduation: 'Class of 2028'
  },
  research: {
    venue: 'Springer ICCCN 2025',
    title: 'Building the Decentralized Future: Blockchain Innovation with Ethereum at the Core',
    description: 'Published and presented research focused on blockchain, Ethereum, and Web3 technologies.',
    recognition: 'Awarded First Prize among international research presentations at the Springer International Conference organized in collaboration with Manchester Metropolitan University, UK.',
    url: 'https://link.springer.com/chapter/10.1007/978-3-032-21499-7_27'
  } satisfies Research,
  certifications: [
    {
      name: 'Programming in Python',
      issuer: 'Meta',
      date: 'Issued Feb 2026',
      credentialId: 'OUT6MC6AEX30',
      url: 'https://www.coursera.org/account/accomplishments/verify/OUT6MC6AEX30'
    },
    {
      name: 'Introduction to Back-End Development',
      issuer: 'Meta',
      date: 'Issued Jan 2026',
      credentialId: '7GW0H2L9HF6U',
      url: 'https://www.coursera.org/account/accomplishments/verify/7GW0H2L9HF6U'
    }
  ] satisfies Certification[],
  experience: [
    {
      role: 'Vice President, Operations',
      company: 'E-Cell, Bennett University',
      date: 'Sep 2026 - Present',
      description: 'Coordinate programs and cross-functional teams for entrepreneurship initiatives.',
      bullets: []
    },
    {
      role: 'Design Lead',
      company: 'GDG On Campus, Bennett University',
      date: 'Sep 2025 - May 2026',
      description: 'Led visual direction and communication for a developer community.',
      bullets: []
    },
    {
      role: 'Design Lead',
      company: 'E-Cell, Bennett University',
      date: 'Jan 2025 - Dec 2025',
      description: 'Directed design and brand communication for student entrepreneurship programs.',
      bullets: []
    }
  ] satisfies Experience[],
  contact: {
    message: 'I am currently open to internships and junior developer opportunities. If you have an exciting project, a role that fits my profile, or just want to connect, feel free to reach out!',
    email: 'dhruv.mehta3141@gmail.com',
    phone: '+91 7986692577',
    phoneHref: 'tel:7986692577',
    github: 'https://github.com/dhruvmehta221105',
    linkedin: 'https://www.linkedin.com/in/dhruv-mehta22'
  }
};
