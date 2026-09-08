export type MediaType = 'image' | 'video';

export type LayoutVariant = 'landscape' | 'offset-left' | 'offset-right' | 'immersive' | 'duo';

export interface ProjectMetric {
  value: string;
  label: string;
}

export interface GalleryItem {
  /** Path relative to /public, e.g. "/projects/foo/dashboard.png" */
  src: string;
  alt?: string;
  /** Shown as a small file-label caption. Derived from `src`'s last path segment if omitted. */
  filename?: string;
  /** Intrinsic pixel dimensions — currently only used to sort an AssetShowcase grid by visual size (smallest first). Optional; omit if unknown. */
  width?: number;
  height?: number;
}

/** A gallery entry can be a plain path (filename/alt derived automatically) or a GalleryItem for custom alt text/filename. */
export type GalleryEntry = string | GalleryItem;

/**
 * An optional extra showcase section rendered before the gallery — e.g.
 * Cat Blast's handmade block assets. Reuses the same GalleryEntry shape and
 * the project gallery's fullscreen lightbox, so it stays a thin data-only
 * addition rather than a parallel media system.
 */
export interface AssetShowcase {
  title: string;
  description: string;
  items: GalleryEntry[];
}

export interface Project {
  /** Unique slug, also used as the folder name under /public/projects/<id>/ */
  id: string;
  title: string;
  /** Omit if unknown — hidden from the card/detail metadata rather than guessed. */
  year?: string;
  /** e.g. "Backend / AI" — shown as compact metadata on the card and detail header. */
  category: string;
  /** One or two sentences shown on the homepage. */
  description: string;
  /** Full "Overview" write-up shown in the project detail overlay. */
  longDescription: string;
  /** Path relative to /public, e.g. "/projects/foo/cover.jpg" */
  thumbnail: string;
  /** Second cover image for the "duo" card layout (shown side-by-side with `thumbnail`). Ignored by other layouts. */
  thumbnailSecondary?: string;
  /** Large image shown at the top of the project detail overlay. Falls back to `thumbnail` if omitted. */
  detailImage?: string;
  mediaType: MediaType;
  featured?: boolean;
  /** Shown as tags in the detail view and, abbreviated, as a stack line on the card. */
  technologies: string[];
  /** Extra images shown in the detail overlay gallery. */
  gallery: GalleryEntry[];
  /** Optional extra asset grid shown before the gallery — e.g. Cat Blast's handmade blocks. Omit entirely for projects without one. */
  assetShowcase?: AssetShowcase;
  /**
   * A YouTube, Vimeo, or local (/videos/...) URL for a demo recording.
   * Only used when mediaType is "video". Leave empty until you have a real
   * video — the detail view falls back to the cover image.
   */
  videoUrl?: string;
  github?: string;
  liveDemo?: string;
  /** e.g. "Completed", "In Progress" — shown as a small tag in the detail header. */
  status?: string;
  problem?: string;
  solution?: string;
  /** Free-form multi-line text diagram (arrows, boxes) rendered in a monospace block. */
  architecture?: string;
  challenges?: string[];
  highlights?: string[];
  outcome?: string;
  /** Only rendered if non-empty — never fabricate numbers here. */
  metrics?: ProjectMetric[];
  /** Optional manual layout override; otherwise the homepage cycles through variants. */
  layout?: LayoutVariant;
}
