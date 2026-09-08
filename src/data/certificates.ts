export interface Certificate {
  title: string;
  /** e.g. "Ongoing" — shown instead of a link when there is no certificate URL yet. */
  status?: string;
  url?: string;
}

export const certificates: Certificate[] = [
  {
    title: 'The Complete Full-Stack Web Development Bootcamp',
    status: 'Ongoing',
  },
  {
    title: 'Python | Advanced Programming from Scratch',
    url: 'http://ude.my/UC-fe9f12a1-217e-4936-9cfd-12738972f8ba',
  },
  {
    title: 'The Project Management Course: Beginner to Project Manager',
    url: 'http://ude.my/UC-a142042b-da06-4888-8c82-fdc4cd928135',
  },
];
