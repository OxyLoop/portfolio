import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { GalleryEntry } from '@/types/project';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface NormalizedGalleryItem {
  src: string;
  alt: string;
  filename: string;
}

/**
 * Resolves each gallery entry (a plain path string, or a GalleryItem with
 * explicit alt/filename) into a consistent shape. A missing filename is
 * derived from the path's last segment (e.g. "/projects/foo/dashboard.png"
 * → "dashboard.png") rather than requiring it to be written out by hand.
 */
export function normalizeGalleryItems(
  entries: GalleryEntry[],
  fallbackAlt: (index: number) => string
): NormalizedGalleryItem[] {
  return entries.map((entry, i) => {
    const src = typeof entry === 'string' ? entry : entry.src;
    const explicitFilename = typeof entry === 'string' ? undefined : entry.filename;
    const explicitAlt = typeof entry === 'string' ? undefined : entry.alt;
    const filename = explicitFilename || src.split('/').pop() || src;
    return { src, filename, alt: explicitAlt || fallbackAlt(i) };
  });
}

/**
 * Prefixes a root-relative asset path (e.g. "/projects/foo/cover.jpg") with
 * the site's GitHub Pages base path so raw <img>/<video>/CSS references
 * resolve correctly when deployed under a repo subdirectory. next/image and
 * next/link handle this automatically — this helper is only needed for the
 * few places that reference /public assets directly (e.g. <video> sources).
 */
export function withBasePath(path: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  if (!path.startsWith('/')) return path;
  return `${basePath}${path}`;
}

export type VideoKind = 'youtube' | 'vimeo' | 'local' | 'unknown';

export function detectVideoKind(url: string): VideoKind {
  if (!url) return 'unknown';
  if (/youtube\.com|youtu\.be/.test(url)) return 'youtube';
  if (/vimeo\.com/.test(url)) return 'vimeo';
  if (/\.(mp4|webm|mov)$/i.test(url)) return 'local';
  return 'unknown';
}

export function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{6,})/
  );
  return match?.[1] ?? null;
}

export function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match?.[1] ?? null;
}
