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
  bullets: string[];
};

export const portfolioData = {
  person: {
    name: 'Dhruv Mehta',
    firstName: 'Dhruv',
    logoName: 'Dhruv Mehta',
    headline: ['FULLSTACK', '& AI/ML', 'ENGINEER'],
    greeting: 'Hello, my name is Dhruv and I am a',
    avatar: '/avatar.png',
    fallbackAvatar: '/avatar.jpg',
    location: '3rd Year Student',
    specialties: ['React', 'TypeScript', 'Python', 'PyTorch', 'SQL'],
    intro: "Combining full-stack development with AI to build impactful digital solutions. I'm someone who enjoys exploring new ideas, experimenting with emerging technologies, and constantly pushing myself to become a better developer.",
    about: "I'm a third-year Computer Science student passionate about creating products that combine thoughtful design with powerful technology. My interests span full-stack web development, artificial intelligence, and machine learning, where I focus on building applications that are fast, scalable, and solve real-world problems. I'm always looking for opportunities to learn, innovate, and grow as a developer.",
    availableForWork: true,
    resume: {
      url: '/Tapasya_Shrestha_Resume.pdf',
      filename: 'Tapasya_Shrestha_Resume.pdf'
    }
  },
  navigation: {
    items: ['projects', 'skills', 'about', 'contact'],
    aboutLabel: 'education & experience'
  },
  skills: ['React.js', 'TypeScript', 'Python', 'PyTorch'],
  projects: [
    {
      id: 1,
      title: 'InterviewX - AI-Powered Interview Preparation Platform',
      shortTitle: 'InterviewX',
      image: '/Sehai.jpg',
      category: 'AI-Powered Interview Platform',
      github: 'https://github.com/tapasyashrestha/Sehai',
      tech: ['React.js', 'TypeScript', 'Tailwind CSS', 'Vite', 'React Router', 'XGBoost', 'Python'],
      bullets: [
        'Developed a voice-enabled healthcare platform to assist ANMs (Auxiliary Nurse Midwives) in recording patient symptoms and managing rural healthcare workflows.',
        'Integrated an XGBoost classifier trained on symptom data to predict probable diseases, enabling early diagnosis support for frontline healthcare workers in low-resource rural settings.',
        'Designed an AI-assisted triage and referral system enabling seamless escalation of cases from Sub-Centres/ANMs -> PHCs (Primary Health Centres) -> CHCs (Community Health Centres).',
        'Implemented multilingual symptom-reporting workflows to improve accessibility for healthcare workers and patients across diverse linguistic regions.'
      ]
    },
    {
      id: 0,
      title: 'Kavach ',
      shortTitle: 'Vakeel',
      image: '/Vakeel.jpg',
      category: 'B2B Legal Tech Platform',
      github: 'https://github.com/tapasyashrestha/Vakeel',
      tech: ['Firebase Auth', 'Firestore', 'Firebase Storage', 'FastAPI', 'React', 'OpenAI Embeddings', 'Indian Kanoon API'],
      bullets: [
        'Designing a B2B legal tech platform enabling advocate chambers to manage drafting, case research, and document workflows with verified, source-traceable outputs rather than raw generative speed.',
        'Architected a multi-tenant system using Firebase custom claims and Firestore path-based collection structure, with security rules enforcing strict per-chamber data isolation.',
        'Built a Retrieval-Augmented Generation (RAG) pipeline separating the public Indian Kanoon case-law corpus from private chamber document embeddings, ensuring no cross-tenant leakage.',
        'Defined core product systems spanning a Unified Retrieval Engine, Drafting Layer, Document Handling, Chamber Activity Layer, and a human-entered Deadlines & Obligations Engine; produced full PRD and system architecture documentation.'
      ]
    },
    {
      id: 2,
      title: 'ManageMyBiz - AI-Powered Business Management Platform',
      shortTitle: 'Tarang',
      image: '/Tarang.jpg',
      category: 'AI-Powered Decision Intelligence Platform',
      github: 'https://github.com/tapasyashrestha/Tarang',
      tech: ['React', 'Tailwind CSS', 'Recharts', 'FastAPI', 'Scikit-learn', 'XGBoost', 'Pandas', 'PostgreSQL'],
      bullets: [
        'Built a decision intelligence platform that simulates the ripple effects of business decisions (price, inventory, marketing spend) on sales, revenue, delivery performance, and customer satisfaction before implementation.',
        'Implemented dependency and causality mapping using ML-driven scenario simulation to surface hidden relationships between business variables.',
        'Developed risk and consequence detection to flag potential inventory shortages, delivery delays, and rating declines ahead of time, alongside a what-if simulator and revenue/sales forecasting.',
        'Designed an interactive business dashboard (React + Recharts) translating model outputs into strategic recommendations for decision-makers.'
      ]
    }
  ] satisfies Project[],
  education: {
    degree: 'B.Tech in Computer Science and Engineering',
    status: 'Currently: 3rd Year',
    graduation: 'Class of 2028'
  },
  certifications: [
    'Certificate of Appreciation - SKILLiGENCE EdTech Pvt. Ltd. (Jul 2026)',
    'Internship Appreciation Letter - SKILLiGENCE EdTech Pvt. Ltd. (Jul 2026)'
  ],
  experience: [
    {
      role: 'AI-ML Intern',
      date: '20 May 2026 - 4 Jul 2026',
      company: 'SKILLiGENCE EdTech Pvt. Ltd.',
      bullets: [
        'Selected as AI-ML Intern to design and build AI/ML projects for the company over the internship period.',
        'Delivered multiple production-ready packages and source code submissions in line with internship deliverables.',
        'Completed the internship successfully and received an Internship Appreciation Letter and Certificate of Appreciation.'
      ]
    },
    {
      role: 'Senior Coordinator',
      date: 'May 2025 - May 2026',
      company: 'LearnIT Club',
      bullets: [
        'Organized campus-wide hackathons, technical workshops, and coding challenges.',
        'Mentored 10+ junior members in Web Development and Machine Learning foundations.',
        'Led cross-functional teams in club management and coordinated speaker events.'
      ]
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
