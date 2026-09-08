'use client';

import { useEffect, useMemo, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import type { GalleryEntry } from '@/types/project';
import { normalizeGalleryItems, withBasePath } from '@/lib/utils';
import { useRandomSequentialActivation } from '@/hooks/useRandomSequentialActivation';
import ProjectLightbox from '@/components/ProjectLightbox';

interface AssetShowcaseProps {
  items: GalleryEntry[];
  title: string;
}

/** How long a single GIF stays "active" (playing) before a different random one takes over. */
const GIF_ROTATE_INTERVAL_MS = 2600;
/** Piece size range, in px, from the smallest asset to the largest. */
const MIN_PIECE_SIZE = 92;
const MAX_PIECE_SIZE = 184;

function isGifSrc(src: string) {
  return src.toLowerCase().endsWith('.gif');
}

/** Smallest-looking first: sorts by intrinsic width × height, unknown-size entries treated as smallest. */
function entryArea(entry: GalleryEntry): number {
  if (typeof entry === 'string') return 0;
  return (entry.width ?? 0) * (entry.height ?? 0);
}

/**
 * A fluid piece size for position `rank` out of `count` (0 = smallest, last
 * = largest): a CSS clamp() so it also shrinks gracefully on narrow
 * viewports without any JS viewport tracking — the vw-based middle value
 * scales with the screen, floored/ceilinged by fixed px bounds.
 */
function pieceSize(rank: number, count: number): string {
  const t = count > 1 ? rank / (count - 1) : 1;
  const px = Math.round(MIN_PIECE_SIZE + (MAX_PIECE_SIZE - MIN_PIECE_SIZE) * t);
  const floor = Math.round(px * 0.6);
  const vw = ((px / 1600) * 100).toFixed(2);
  return `clamp(${floor}px, ${vw}vw, ${px}px)`;
}

/**
 * Renders one block's artwork. For GIFs, a captured first-frame poster is
 * shown by default (a snapshot painted onto an offscreen canvas once the gif
 * has loaded) and swapped for the live animated source only while `active` —
 * this is what makes the board's GIF motion feel like one curated piece at a
 * time rather than every animation running at once. PNGs are unaffected.
 */
function BlockArtwork({ src, alt, isGif, active }: { src: string; alt: string; isGif: boolean; active: boolean }) {
  const [poster, setPoster] = useState<string | null>(null);

  useEffect(() => {
    if (!isGif) return;
    let cancelled = false;
    const probe = new Image();
    probe.onload = () => {
      if (cancelled) return;
      // A freshly-loaded <img> for a GIF paints its first frame — capturing
      // that to a canvas immediately gives a reliable static poster without
      // needing a separately-authored poster file.
      const canvas = document.createElement('canvas');
      canvas.width = probe.naturalWidth;
      canvas.height = probe.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(probe, 0, 0);
      try {
        setPoster(canvas.toDataURL());
      } catch {
        // Canvas tainted (shouldn't happen for same-origin assets) — fall
        // back to always showing the live gif for this block.
      }
    };
    probe.src = src;
    return () => {
      cancelled = true;
    };
  }, [isGif, src]);

  const displaySrc = isGif && !active && poster ? poster : src;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- plain <img> so GIFs animate natively and pixel art can opt out of Next's resizing/smoothing
    <img
      src={displaySrc}
      alt={alt}
      loading="lazy"
      decoding="async"
      style={{ imageRendering: 'pixelated' }}
      className="max-h-full max-w-full origin-center object-contain transition-transform duration-300 ease-premium group-hover/block:scale-[1.15]"
    />
  );
}

/**
 * A single compact "playfield" board — built for Cat Blast's handmade block
 * showcase, but generic enough for any project's `assetShowcase`. Pieces
 * wrap freely inside one board-like surface, each sized along a continuous
 * small-to-large scale (rather than uniform identical cards), keeping its
 * own aspect ratio via object-contain and pixelated rendering for crisp
 * low-res pixel art. Flexbox wrap — not a CSS grid — is deliberate: it packs
 * variably-sized pieces left-to-right/top-to-bottom without ever leaving the
 * kind of stray gap a grid's dense-packing can produce when spans don't
 * divide evenly. Filenames stay hidden until hover, as an absolutely
 * positioned label so they never shift the board's layout. Reuses the same
 * GalleryEntry data model and ProjectLightbox as the regular gallery — no
 * second fullscreen viewer, no duplicated filename-derivation logic.
 */
export default function AssetShowcase({ items, title }: AssetShowcaseProps) {
  const prefersReducedMotion = useReducedMotion();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Smallest-looking blocks first — derived from each asset's own intrinsic
  // dimensions rather than hand-ordering the data, so adding a new block
  // later doesn't require manually re-sorting the list.
  const sortedRaw = useMemo(() => [...items].sort((a, b) => entryArea(a) - entryArea(b)), [items]);

  const normalized = useMemo(
    () => normalizeGalleryItems(sortedRaw, (i) => `${title} — asset ${i + 1}`),
    [sortedRaw, title]
  );

  const gifIndices = useMemo(
    () => normalized.reduce<number[]>((acc, item, i) => (isGifSrc(item.src) ? [...acc, i] : acc), []),
    [normalized]
  );

  const activeGifSlot = useRandomSequentialActivation(gifIndices.length, GIF_ROTATE_INTERVAL_MS, !prefersReducedMotion);
  const activeIndex = activeGifSlot !== null ? gifIndices[activeGifSlot] : null;

  if (normalized.length === 0) return null;

  return (
    <>
      {/* The board itself: a slightly elevated dark surface with a very
          faint grid-line texture, evoking a game playfield rather than a
          plain card list. */}
      <div className="relative overflow-hidden rounded-sm border border-line bg-night p-4 md:p-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 text-line opacity-60"
          style={{
            backgroundImage:
              'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />

        <div className="relative flex flex-wrap items-start gap-3 md:gap-4">
          {normalized.map((item, i) => {
            const size = pieceSize(i, normalized.length);
            return (
              <div
                key={item.src}
                style={{ width: size, height: size }}
                className="group/block relative flex-shrink-0 hover:z-10"
              >
                <button
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  data-cursor="VIEW"
                  aria-label={`Open ${item.filename} — asset ${i + 1} of ${normalized.length}`}
                  className="flex h-full w-full items-center justify-center rounded-sm bg-fog/70 p-2 transition-colors duration-300 group-hover/block:bg-fog"
                >
                  <BlockArtwork
                    src={withBasePath(item.src)}
                    alt={item.alt}
                    isGif={isGifSrc(item.src)}
                    active={i === activeIndex}
                  />
                </button>

                {/* Filename label — hidden until hover, absolutely positioned
                    so it never affects the board's layout or shifts neighbors. */}
                <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-sm bg-canvas/95 px-2 py-0.5 font-mono text-[11px] tracking-wide text-accent opacity-0 transition-opacity duration-200 group-hover/block:opacity-100">
                  {item.filename}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <ProjectLightbox
        items={normalized}
        title={title}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
        imageRendering="pixelated"
        sizePreset="compact"
      />
    </>
  );
}
