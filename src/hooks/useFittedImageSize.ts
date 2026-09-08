'use client';

import { useEffect, useState } from 'react';

interface FittedImageSizeOptions {
  /** Upper bound as a percentage of viewport width. */
  maxWidthVw: number;
  /** Upper bound as a percentage of viewport height. */
  maxHeightVh: number;
  /** Never render smaller than this on the image's shorter side (still capped by the max bounds above). */
  minPx: number;
}

/**
 * Computes a pixel width/height for `src` that fits within the given
 * viewport-relative bounds while matching the image's own aspect ratio —
 * unlike a fixed vw/vh box (which stays the same regardless of whether the
 * image is portrait, landscape, or tiny), this makes the rendered box hug
 * the actual picture. That matters for click-outside-to-close: a fixed-width
 * box on a narrow portrait photo left a wide invisible strip on either side
 * that silently ate "outside" clicks instead of closing the viewer.
 * Small sources are boosted up to `minPx` (still capped by the max bounds)
 * so pixel-art assets don't render at their native few dozen pixels.
 * Returns null until the image's natural dimensions are known.
 */
export function useFittedImageSize(src: string, { maxWidthVw, maxHeightVh, minPx }: FittedImageSizeOptions) {
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [viewport, setViewport] = useState(() => ({
    w: typeof window !== 'undefined' ? window.innerWidth : 1280,
    h: typeof window !== 'undefined' ? window.innerHeight : 720,
  }));

  useEffect(() => {
    let cancelled = false;
    setNatural(null);
    const probe = new Image();
    probe.onload = () => {
      if (!cancelled) setNatural({ w: probe.naturalWidth || 1, h: probe.naturalHeight || 1 });
    };
    probe.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  useEffect(() => {
    const handleResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!natural) return null;

  const maxW = (viewport.w * maxWidthVw) / 100;
  const maxH = (viewport.h * maxHeightVh) / 100;
  let scale = Math.min(maxW / natural.w, maxH / natural.h);

  const minScale = minPx / Math.min(natural.w, natural.h);
  if (minScale > scale) scale = Math.min(minScale, maxW / natural.w, maxH / natural.h);

  return { width: Math.round(natural.w * scale), height: Math.round(natural.h * scale) };
}
