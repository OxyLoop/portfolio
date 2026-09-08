# Arda Sarı — Portfolio

A single-page, cinematic portfolio built with Next.js (App Router), TypeScript, Tailwind CSS, and Framer Motion. Statically exported (`output: "export"`) so it can be hosted for free on **GitHub Pages** — no server, no API routes, no database.

## Tech stack

- **Next.js 14** (static export, no server runtime features)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** for scroll reveals, page transitions, and the custom cursor
- **lucide-react** for icons

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Run locally

```bash
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000).

### 3. Build the static site

```bash
npm run build
```

This produces a fully static site in the `out/` folder — the same folder that gets deployed to GitHub Pages. You can also preview that exact build locally:

```bash
npm run start
```

(this just serves the `out/` folder with `npx serve`, no Next.js server involved — matching what a static host actually serves.)

### 4. Type-check / lint

```bash
npm run typecheck
npm run lint
```

## Deploying to GitHub Pages

A ready-to-use workflow lives at [.github/workflows/deploy.yml](.github/workflows/deploy.yml). It builds the site and publishes the `out/` folder to GitHub Pages on every push to `main`.

**One-time setup in your GitHub repo:**

1. Push this project to a GitHub repository.
2. Go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Push to `main` (or run the workflow manually from the **Actions** tab) — the site will build and deploy automatically.

### About the repo name / base path — do you need to configure anything?

**No manual configuration needed in the common case.** [next.config.mjs](next.config.mjs) automatically detects the correct base path at build time using the `GITHUB_REPOSITORY` environment variable that GitHub Actions sets for you:

- If your repo is named `your-username.github.io` (a user/organization page), the site is served from the domain root and gets **no** base path.
- If your repo is named anything else (e.g. `portfolio`), the site is served from `https://your-username.github.io/portfolio/`, and the build automatically sets `basePath`/`assetPrefix` to `/portfolio` so every asset, link, and image resolves correctly under that subdirectory.

This only applies to the GitHub Actions build. Running `npm run dev` or `npm run build` locally always uses an empty base path, so local development is unaffected.

You genuinely don't need to hardcode your repo name anywhere — just push to a repo with whatever name you like and the workflow figures it out.

### Using a custom domain later

1. Add a `CNAME` file to the `public/` folder containing your domain (e.g. `arda.dev`), OR set it in **Settings → Pages → Custom domain** (GitHub creates the `CNAME` file for you).
2. Point your domain's DNS at GitHub Pages (an `A`/`ALIAS`/`CNAME` record — see [GitHub's custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)).
3. Once a custom domain is set, the site is served from the domain root, so you'll want the base path to be empty. The simplest way: rename your repo to `your-username.github.io`, or just hardcode `basePath: ''` in `next.config.mjs` once you're on a custom domain permanently.

## Editing your content

Everything you'll want to change as a non-developer lives in two files:

### `src/data/siteConfig.ts` — your name, tagline, links, About copy

```ts
export const siteConfig = {
  name: 'Arda Sarı',
  role: 'Computer Engineer',
  secondaryAreas: 'Software Development · Backend · AI · Game Development',
  tagline: 'Building software, intelligent systems and digital products.',
  email: 'you@example.com',
  resume: '',
  social: {
    github: 'https://github.com/yourhandle',
    linkedin: '',
  },
  about: {
    bio: '...',
    personalityLine: '...',
    education: {
      school: '...',
      degree: '...',
      period: '...',
      meta: '...',      // e.g. "Full Scholarship / GPA 3.00"
      honors: [...],    // small bullet list, e.g. honour terms, club roles
    },
    languages: '...',   // spoken languages, e.g. "Turkish (Native) · English (C1)"
    softSkills: [...],
  },
  // ...
};
```

### `src/data/certificates.ts` — certifications

```ts
{ title: 'Course name', status: 'Ongoing' }              // no link yet
{ title: 'Course name', url: 'https://...' }              // links out instead of showing a status
```

Kept intentionally lightweight — this list lives inside the About section rather than as its own page section, so certifications never outweigh Projects or Experience.

Leave a social link (or `resume`) as an empty string `''` and it will render as a greyed-out, non-clickable label on the site instead of a broken link — a visible reminder to fill it in.

### `src/data/skills.ts` — your skills, grouped by category

```ts
{ category: 'Languages', items: ['Python', 'Java', 'C++'] }
```

No percentages or skill levels — just an honest, organized list. Add, remove, or rename categories and items freely; the layout adapts automatically.

### `src/data/experience.ts` — your work history

```ts
{
  period: '2025 — Present',
  role: 'Backend Developer',
  company: 'Company Name',
  description: 'What you worked on.',
  stack: ['Python', 'FastAPI', 'PostgreSQL'],  // optional
}
```

Most recent first. Copy an entry to add another.

### `src/data/projects.ts` — your projects

Each project is one object in an array. To add a new project, **copy an existing object, change the `id`, and fill in your own content**:

```ts
{
  id: 'my-new-project',          // unique, used as the folder name under /public/projects/
  title: 'My New Project',
  year: '2026',            // optional — omit it and the year is simply hidden, not guessed
  category: 'Backend / AI',
  description: 'One or two sentences shown on the homepage.',
  longDescription: 'The "Overview" shown when the project is opened.',
  thumbnail: '/projects/my-new-project/cover.jpg',
  mediaType: 'image',            // 'image' | 'video'
  videoUrl: '',                  // YouTube/Vimeo/local demo recording, if any
  technologies: ['Python', 'FastAPI', 'PostgreSQL'],
  gallery: [
    '/projects/my-new-project/01.jpg',
    '/projects/my-new-project/02.jpg',
  ],
  github: '',                    // hidden automatically if empty
  liveDemo: '',                  // hidden automatically if empty
  status: 'Completed',           // small tag next to the category/year, optional
  problem: 'What problem this addresses.',
  solution: 'How the system solves it.',
  architecture: 'Client\n   ↓\nAPI\n   ↓\nDatabase',   // optional multi-line text diagram
  challenges: ['An interesting engineering problem you ran into.'],
  outcome: 'What was achieved or learned.',
  highlights: [],                // optional bullet points shown under Outcome
  metrics: [],                   // optional [{ value: '100K+', label: 'Records processed' }] — never invent numbers
  layout: 'landscape',           // controls the homepage layout, see below
}
```

**Adding your own images:** drop files into a new folder under `public/projects/<id>/` and point `thumbnail`/`gallery` at them (paths are relative to `/public`, so `public/projects/my-new-project/cover.jpg` → `/projects/my-new-project/cover.jpg`). Screenshots, dashboards, architecture diagrams, or data viz output all work well here — keep the visual attractive rather than filling the frame with code.

- `mediaType: 'image'` — the detail view shows the cover screenshot large; no video embed.
- `mediaType: 'video'` — set `videoUrl` to a YouTube or Vimeo link (any standard watch/share URL works) or a local file under `public/videos/`, for a demo recording. Leave `videoUrl` empty and the site gracefully shows a "Video coming soon" placeholder instead of a broken embed.
- `github` / `liveDemo` — each renders as a small link under the main visual, and is hidden automatically (not shown broken/disabled) when left empty.
- `architecture` / `challenges` / `highlights` / `metrics` are all optional — any section left empty or undefined is skipped entirely in the detail view rather than shown blank. Only fill in `metrics` once you have real numbers.
- `layout` — one of `'landscape'`, `'offset-left'`, `'offset-right'`, `'immersive'`, `'duo'`. This is what gives the homepage its editorial, non-repetitive rhythm; omit it and it defaults to `'landscape'`.
- The placeholder SVG images that ship with the project were generated by `scripts/generate-placeholders.mjs` — safe to delete once you've added your own real screenshots.

### Everything else

- **Fonts / colors** — `tailwind.config.ts` (`colors.accent` is the single accent color used sparingly throughout) and the font imports in `src/app/layout.tsx`.
- **Section copy that isn't project- or person-specific** (e.g. the "Selected Projects" intro line) lives directly in the relevant component (`src/components/ProjectSection.tsx`, etc.) — everything personal has been pulled out into `siteConfig.ts` already.

## Notes on the static export

- No Server Actions, API routes, middleware, or server-side data fetching are used anywhere — everything renders at build time into plain HTML/CSS/JS.
- `next/image` is configured with a custom loader (`src/lib/imageLoader.ts`) instead of `unoptimized: true` — this is required so image URLs correctly pick up the GitHub Pages base path when the site is deployed under a repo subdirectory. There's no image-resizing server in production, so serve reasonably-sized source images yourself.
- `public/.nojekyll` is included so GitHub Pages doesn't run Jekyll over the `_next` folder (which starts with an underscore and would otherwise be ignored).
- `trailingSlash: true` is set in `next.config.mjs`, which is what makes static hosts like GitHub Pages resolve `/about/` style URLs to `index.html` files correctly.
- A note on `npm audit`: the installed Next.js version has some known advisories, but nearly all of them concern Server Actions, Middleware, and the Image Optimization *server* — none of which exist in this project's build output, since it's a static export with no Next.js server running in production.

## Accessibility & performance

- Respects `prefers-reduced-motion` — animations are disabled at the CSS level for users who request it, and JS-driven parallax/motion checks `useReducedMotion()` before applying transforms.
- Keyboard-navigable: project cards, the project detail overlay (focus is moved to the close button on open, `Escape` closes it, and background content is marked `inert` while the overlay is closed to avoid stray Tab focus into fixed, transitioning content), and the mobile menu all work without a mouse.
- The custom cursor is desktop-only (detected via `(hover: hover) and (pointer: fine)`) and never removes the native cursor until it has confirmed it can render — if JS fails, the native cursor is simply never hidden.
- Videos and gallery images are lazy-loaded; nothing autoplays or downloads until a user explicitly opens a project or clicks play.
