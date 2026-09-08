export interface SkillCategory {
  category: string;
  items: string[];
}

/**
 * Grouped, not scored — no percentage bars or skill levels, just an honest
 * list organized by area. Add/remove items or whole categories freely.
 */
export const skills: SkillCategory[] = [
  {
    category: 'Languages',
    items: ['JavaScript', 'C#', 'Java', 'C', 'Python'],
  },
  {
    category: 'Backend',
    items: ['Node.js', 'RESTful APIs'],
  },
  {
    category: 'Databases',
    items: ['MongoDB', 'SQL'],
  },
  {
    category: 'Cloud & Server',
    items: ['AWS', 'EC2', 'Deployment & Server Management', 'Termius'],
  },
  {
    category: 'Frontend',
    items: ['HTML', 'CSS', 'React.js', 'JavaFX'],
  },
  {
    category: 'Game Development',
    items: ['Unity', 'C#', 'Backend–Unity Integration'],
  },
  {
    category: 'Tools',
    items: ['Git', 'Gradle', 'Maven', 'Postman'],
  },
];
