// One-off generator for placeholder SVG imagery so the design looks
// complete before real project screenshots are added. Not part of the app build.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public', 'projects');

const projects = [
  {
    id: 'adwise',
    label: 'AdWise',
    from: '#101625',
    to: '#3B4C8C',
    images: [
      { name: 'cover', w: 1920, h: 1080 },
      { name: '01', w: 1600, h: 1000 },
      { name: '02', w: 1600, h: 1000 },
    ],
  },
  {
    id: 'airadar',
    label: 'AIRadar',
    from: '#12203A',
    to: '#2E6F8E',
    images: [
      { name: 'cover', w: 1920, h: 1080 },
      { name: '01', w: 1600, h: 1000 },
      { name: '02', w: 1600, h: 1000 },
    ],
  },
  {
    id: 'pagepal',
    label: 'PagePal',
    from: '#16181F',
    to: '#46527A',
    images: [
      { name: 'cover', w: 1400, h: 1750 },
      { name: '01', w: 1400, h: 1750 },
    ],
  },
  {
    id: 'cat-blast',
    label: 'Cat Blast',
    from: '#171A22',
    to: '#6B5FA8',
    images: [
      { name: 'cover', w: 1200, h: 1500 },
      { name: '01', w: 1200, h: 1500 },
      { name: '02', w: 1200, h: 1500 },
    ],
  },
];

function svg({ w, h, from, to, label, tag }) {
  const id = `g-${Math.random().toString(36).slice(2, 8)}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${from}" />
      <stop offset="100%" stop-color="${to}" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#${id})" />
  <g opacity="0.12" stroke="#F5F3F0" stroke-width="1">
    ${Array.from({ length: 10 })
      .map((_, i) => `<line x1="${(i * w) / 9}" y1="0" x2="${(i * w) / 9}" y2="${h}" />`)
      .join('\n    ')}
  </g>
  <text x="${w / 2}" y="${h / 2}" font-family="Georgia, serif" font-style="italic" font-size="${Math.round(
    Math.min(w, h) / 14
  )}" fill="#F5F3F0" fill-opacity="0.85" text-anchor="middle" dominant-baseline="middle">${label}</text>
  <text x="32" y="${h - 28}" font-family="monospace" font-size="18" letter-spacing="2" fill="#F5F3F0" fill-opacity="0.5">${tag}</text>
</svg>`;
}

for (const project of projects) {
  const dir = join(publicDir, project.id);
  mkdirSync(dir, { recursive: true });
  for (const img of project.images) {
    const content = svg({
      w: img.w,
      h: img.h,
      from: project.from,
      to: project.to,
      label: project.label,
      tag: `PLACEHOLDER — ${img.name.toUpperCase()}`,
    });
    writeFileSync(join(dir, `${img.name}.svg`), content, 'utf-8');
  }
}

// About portrait placeholder
const aboutDir = join(publicDir, 'about');
mkdirSync(aboutDir, { recursive: true });
writeFileSync(
  join(aboutDir, 'portrait.jpeg'),
  svg({ w: 1200, h: 1500, from: '#22252C', to: '#5B6472', label: 'Portrait', tag: 'PLACEHOLDER — PORTRAIT' }),
  'utf-8'
);

console.log('Placeholder assets generated.');
