/**
 * Central place for all personal / editable copy and links.
 * Change your name, tagline, socials, and About content here —
 * you should not need to touch any component to update this information.
 */
export const siteConfig = {
  name: 'Arda Sarı',
  shortName: 'Arda Sarı',
  role: 'Computer Engineer',
  secondaryAreas: 'Software Development · Backend · AI · Game Development',
  tagline: 'Building software, intelligent systems and digital products.',
  /** Used for the page <meta name="description">, distinct from the on-screen tagline. */
  description:
    'Computer Engineering graduate focused on software development, backend systems, artificial intelligence and game development.',

  email: 'ardasari4859@gmail.com',
  /** Link to a hosted PDF résumé, e.g. "/resume/Arda-Sari-CV.pdf". Leave empty to hide the Resume link in Contact. */
  resume: '',

  social: {
    github: 'https://github.com/OxyLoop',
    linkedin: 'https://www.linkedin.com/in/arda-sari/',
  },

  nav: [
    { label: 'Projects', href: '#projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'Experience', href: '#experience' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ],

  about: {
    eyebrow: 'Profile',
    heading: 'The engineer behind the systems',
    bio: 'Computer Engineering graduate interested in software development, backend systems, artificial intelligence and game development. I enjoy turning engineering ideas into practical products and continuously exploring new technologies.',
    personalityLine:
      'I enjoy understanding how systems work, connecting different technologies and turning ideas into practical software.',
    portrait: '/projects/about/portrait.jpeg',
    education: {
      school: 'Izmir University of Economics',
      degree: 'B.Sc. Computer Engineering',
      period: '2021 — 2026',
      meta: 'Full Scholarship / GPA 3.00',
      honors: [
        '2021–2022 Spring Term High Honour Student',
        '2022–2023 Fall Term Honour Student',
        'Theatre Club — Vice President',
      ],
    },
    languages: 'Turkish (Native) · English (C1) · German (A2)',
    softSkills: [
      'Team Collaboration',
      'Technical Communication',
      'Problem Solving',
      'Cross-platform Thinking — Web / Backend / Unity',
      'Presentation & Public Speaking',
    ],
  },

  contact: {
    heading: "Let's build something useful.",
    sub: 'Open to internships, collaborations, and interesting engineering problems.',
  },

  footer: {
    note: 'Designed & engineered with care.',
  },
} as const;

export type SiteConfig = typeof siteConfig;
