import type { Project } from '@/types/project';

/**
 * All portfolio projects live here. To add a new one, copy an object below,
 * give it a unique `id`, and drop matching images into
 * /public/projects/<id>/ (a `cover` image plus anything referenced in `gallery`).
 *
 * - `mediaType: 'image'` — the detail view shows the cover screenshot large.
 * - `mediaType: 'video'` — set `videoUrl` to a YouTube/Vimeo link or a local
 *   file under /public/videos/ once you have a demo recording. Leave it
 *   empty and the site shows a "Video coming soon" placeholder instead of a
 *   broken embed.
 * - `gallery` — each entry can be a plain path string (its caption/filename
 *   label is derived automatically from the path, e.g. "dashboard.png"),
 *   or `{ src, alt, filename }` when you want custom alt text or a filename
 *   different from the actual file on disk.
 * - `assetShowcase` — optional extra grid rendered before the gallery (e.g.
 *   Cat Blast's handmade blocks). Omit entirely for projects that don't need
 *   one; `items` uses the same shape as `gallery`.
 * - `github` / `liveDemo` — leave empty to hide that link automatically.
 * - `year` / `problem` / `solution` / `architecture` / `challenges` /
 *   `highlights` / `outcome` / `metrics` are all optional — any section left
 *   empty is hidden in the detail view rather than rendered blank. Never
 *   fill `metrics` with invented numbers; leave it out until you have real
 *   ones.
 */
export const projects: Project[] = [
  {
    id: 'adwise',
    title: 'AdWise',
    category: 'AI / Computer Vision',
    description:
      'A smart digital signage system that uses real-time face detection and anonymous age and gender analysis to display targeted advertisements.',
    longDescription:
      'AdWise is my graduation project, designed as an AI-powered digital signage system. It performs real-time face detection and anonymous age/gender analysis and uses the detected demographic information to select and display targeted advertisements.',
    thumbnail: '/projects/adwise/hero.png',
    mediaType: 'image',
    featured: true,
    technologies: ['Python', 'FastAPI', 'OpenCV', 'MediaPipe', 'Tailwind CSS'],
    gallery: [
      { src: '/projects/adwise/kiosk-display.png', alt: 'AdWise kiosk display showing the live camera feed' },
      { src: '/projects/adwise/dashboard.png', alt: 'AdWise analytics dashboard' },
      { src: '/projects/adwise/ad-inventory.png', alt: 'AdWise ad inventory management screen' },
      { src: '/projects/adwise/themes.png', alt: 'AdWise display theme selection' },
      { src: '/projects/adwise/reports.png', alt: 'AdWise performance reports view' },
    ],
    github: 'https://github.com/sucreistaken/Adwise',
    liveDemo: '',
    problem: 'Traditional digital signage presents the same content regardless of the audience currently viewing it.',
    solution:
      'AdWise uses real-time computer vision and anonymous demographic analysis to dynamically select advertising content.',
    layout: 'immersive',
  },
  /* Temporarily disabled — reactivate when ready.
  {
    id: 'airadar',
    title: 'AIRadar Website',
    category: 'Web Development',
    description:
      'A responsive multilingual product website developed for the AIRadar application, an AI and AR/VR-based medical education platform.',
    longDescription:
      'Developed a responsive multilingual product website for AIRadar using Next.js, React, TypeScript, Tailwind CSS and next-intl. The website presents an AI and AR/VR-based medical education platform through a modern responsive interface.',
    thumbnail: '/projects/airadar/cover.svg',
    mediaType: 'image',
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'next-intl'],
    gallery: ['/projects/airadar/01.svg', '/projects/airadar/02.svg'],
    github: 'https://github.com/OxyLoop/airadarsite',
    liveDemo: '',
    layout: 'landscape',
  },
  */
  /* Temporarily disabled — reactivate when ready.
  {
    id: 'pagepal',
    title: 'PagePal',
    category: 'Software Engineering',
    description: 'A Java-based library management application developed to organize and manage book records.',
    longDescription:
      'PagePal is a Java library management application for organizing and managing book records, covering the full record lifecycle from adding and tagging to importing and exporting.',
    thumbnail: '/projects/pagepal/cover.svg',
    mediaType: 'image',
    technologies: ['Java'],
    gallery: ['/projects/pagepal/01.svg'],
    github: 'https://github.com/OxyLoop/PagePal-Library-App',
    liveDemo: '',
    highlights: ['Adding books', 'Searching books', 'Editing records', 'Deleting records', 'Tagging', 'Importing books', 'Exporting books'],
    layout: 'offset-left',
  },
  */
  {
    id: 'cat-blast',
    title: 'Cat Blast',
    category: 'Browser Game',
    description: 'A browser-based puzzle game built with HTML, CSS and JavaScript.',
    longDescription:
      'Cat Blast is an interactive browser-based puzzle game with drag-and-drop block placement, line-clearing logic, score calculation, level progression and a responsive game interface.',
    thumbnail: '/projects/cat-blast/Cover1.png',
    thumbnailSecondary: '/projects/cat-blast/Cover2.png',
    detailImage: '/projects/cat-blast/hero.png',
    mediaType: 'image',
    technologies: ['JavaScript', 'HTML', 'CSS'],
    gallery: ['/projects/cat-blast/main-menu.png', '/projects/cat-blast/level-select.png', '/projects/cat-blast/gameplay.png', '/projects/cat-blast/statistics.png', '/projects/cat-blast/settings.png', '/projects/cat-blast/about.png'],
    assetShowcase: {
      title: 'Handmade Blocks',
      description:
        'Every block featured in Cat Blast was individually designed and created by hand, giving the game its own consistent visual identity.',
      // width/height are each asset's real intrinsic pixel size (measured
      // directly from the files) — AssetShowcase sorts the grid by this
      // (smallest visual footprint first) rather than by list order.
      items: [
        { src: '/projects/cat-blast/blocks/Bengal.png', alt: 'Bengal', width: 96, height: 70 },
        { src: '/projects/cat-blast/blocks/Calico.png', alt: 'Calico', width: 64, height: 37 },
        { src: '/projects/cat-blast/blocks/Maine Coon.png', alt: 'Maine Coon', width: 96, height: 98 },
        { src: '/projects/cat-blast/blocks/Turkish Van.png', alt: 'Turkish Van', width: 128, height: 40 },
        { src: '/projects/cat-blast/blocks/Orange Tabby.png', alt: 'Orange Tabby', width: 96, height: 70 },
        { src: '/projects/cat-blast/blocks/Ragdoll.png', alt: 'Ragdoll', width: 96, height: 69 },
        { src: '/projects/cat-blast/blocks/Siamese.png', alt: 'Siamese', width: 32, height: 132 },
        { src: '/projects/cat-blast/blocks/Siamese.gif', alt: 'Siamese', width: 32, height: 45 },
        { src: '/projects/cat-blast/blocks/Persian.gif', alt: 'Persian', width: 32, height: 68 },
        { src: '/projects/cat-blast/blocks/Ginger tabby.gif', alt: 'Ginger Tabby', width: 32, height: 100 },
        { src: '/projects/cat-blast/blocks/Calico2.gif', alt: 'Calico', width: 64, height: 77 },
        { src: '/projects/cat-blast/blocks/Sphynx.gif', alt: 'Sphynx', width: 64, height: 67 },
        { src: '/projects/cat-blast/blocks/Orange Tabby2.gif', alt: 'Orange Tabby', width: 96, height: 109 },
        { src: '/projects/cat-blast/blocks/Tuxedo.gif', alt: 'Tuxedo', width: 96, height: 38 },
        { src: '/projects/cat-blast/blocks/Himalayan.gif', alt: 'Himalayan', width: 64, height: 71 },
        { src: '/projects/cat-blast/blocks/Norwegian Forest.gif', alt: 'Norwegian Forest', width: 64, height: 109 },
      ],
    },
    github: 'https://github.com/OxyLoop/Cat-Blast',
    liveDemo: '',
    highlights: ['Drag-and-drop block placement', 'Line-clearing mechanics', 'Score calculation', 'Level progression', 'Responsive UI'],
    layout: 'duo',
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
