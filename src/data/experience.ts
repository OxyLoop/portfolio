export interface ExperienceEntry {
  period: string;
  role: string;
  company: string;
  description: string;
  stack?: string[];
}

/** Most recent first. Copy an entry to add another. */
export const experience: ExperienceEntry[] = [
  {
    period: 'September 2025 — January 2026',
    role: 'Full Stack Developer',
    company: 'AR ARGE Teknoloji San. ve Tic. A.Ş.',
    description:
      'Worked across frontend, backend and infrastructure development, including REST APIs, internal applications, databases, AWS deployments and Unity integrations.',
    stack: ['JavaScript', 'Node.js', 'REST API', 'MongoDB', 'SQL', 'AWS', 'Unity', 'Postman', 'Git'],
  },
  {
    period: 'July 2025 — August 2025',
    role: 'Full Stack Developer Intern',
    company: 'AR ARGE Teknoloji San. ve Tic. A.Ş.',
    description:
      'Supported full-stack and backend development using JavaScript and Node.js while gaining hands-on experience with databases, APIs, AWS and server-side operations.',
    stack: ['JavaScript', 'Node.js', 'REST API', 'Databases', 'AWS', 'Postman'],
  },
];
