'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion, type PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { NormalizedGalleryItem } from '@/lib/utils';
import { cn, withBasePath } from '@/lib/utils';
import { useFittedImageSize } from '@/hooks/useFittedImageSize';

interface ProjectLightboxProps {
  items: NormalizedGalleryItem[];
  title: string;
  /** Index of the open image, or null when the lightbox is closed. */
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
  /** 'pixelated' keeps low-res pixel-art assets (e.g. Cat Blast's blocks) crisp instead of being smoothed when scaled up. Defaults to normal smoothing. */
  imageRendering?: 'auto' | 'pixelated';
  /**
   * 'compact' (roughly half the linear size of 'full') is for small, mostly
   * square source assets (e.g. Cat Blast's blocks) — 'full' would blow them
   * up to nearly the whole viewport, which both looks oversized and leaves
   * almost no visible backdrop margin to click to close. Defaults to 'full'.
   */
  sizePreset?: 'full' | 'compact';
}

const easeOut = [0.16, 1, 0.3, 1] as const;
const SWIPE_THRESHOLD = 60;

/** Viewport-relative bounds the fitted image box is scaled within, per `sizePreset`. */
const SIZE_BOUNDS = {
  full: { maxWidthVw: 90, maxHeightVh: 86, minPx: 260 },
  compact: { maxWidthVw: 46, maxHeightVh: 44, minPx: 220 },
} as const;

/**
 * Fullscreen image viewer for a project gallery. Sits above ProjectDetail
 * (z-95) but below the site's custom cursor (z-100) so the cursor dot stays
 * visible while browsing.
 *
 * The backdrop stays permanently mounted and toggles pointer-events/inert
 * directly off the `isOpen` boolean rather than relying on AnimatePresence
 * to unmount it after its exit animation — the same fix ProjectDetail needed
 * earlier: nested motion elements each animating their own exit can leave a
 * modal invisible-but-still-blocking-clicks if that exit is ever interrupted
 * (e.g. a backgrounded tab). Only the individual image swap (a purely
 * cosmetic crossfade, not gating interactivity) uses AnimatePresence here.
 */
export default function ProjectLightbox({
  items,
  title,
  index,
  onClose,
  onNavigate,
  imageRendering = 'auto',
  sizePreset = 'full',
}: ProjectLightboxProps) {
  const prefersReducedMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const isOpen = index !== null;
  const total = items.length;

  const [lastIndex, setLastIndex] = useState(0);
  useEffect(() => {
    if (index !== null) setLastIndex(index);
  }, [index]);
  const activeIndex = index ?? lastIndex;
  const active = items[activeIndex];

  // Each fresh open (closed → open) bumps this, remounting the
  // AnimatePresence below instead of letting it "transition" from whatever
  // was last viewed. Without this, opening a *different* image right after
  // closing one first briefly re-shows the previous image mid-exit — since
  // `lastIndex` keeps it mounted (deliberately, so closing fades out the
  // still-visible image rather than snapping to blank) — before the newly
  // clicked one enters. Navigating with prev/next while already open is
  // unaffected: isOpen stays true there, so this never increments mid-browse
  // and that crossfade keeps working as before.
  const [openSession, setOpenSession] = useState(0);
  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (isOpen && !wasOpenRef.current) setOpenSession((s) => s + 1);
    wasOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    if (dialogRef.current) dialogRef.current.inert = !isOpen;
  }, [isOpen]);

  const goPrev = () => onNavigate((activeIndex - 1 + total) % total);
  const goNext = () => onNavigate((activeIndex + 1) % total);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && total > 1) goPrev();
      if (e.key === 'ArrowRight' && total > 1) goNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, activeIndex, total, onClose]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (total <= 1) return;
    if (info.offset.x < -SWIPE_THRESHOLD) goNext();
    else if (info.offset.x > SWIPE_THRESHOLD) goPrev();
  };

  // Sized to the active image's own aspect ratio rather than a fixed
  // vw/vh box — a fixed-width box left a wide invisible strip on either
  // side of a portrait/vertical photo (e.g. Cat Blast's gallery) that
  // silently swallowed "click outside to close" instead of reaching the
  // real backdrop. Falls back to the max bounds while dimensions are
  // still loading, so nothing flashes at 0×0.
  const bounds = SIZE_BOUNDS[sizePreset];
  const fittedSize = useFittedImageSize(active ? withBasePath(active.src) : '', bounds);

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
      aria-label={`${title} — image ${activeIndex + 1} of ${total}`}
      initial={false}
      animate={{ opacity: isOpen ? 1 : 0 }}
      transition={{ duration: prefersReducedMotion ? 0.01 : 0.3, ease: easeOut }}
      onClick={onClose}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      className={cn(
        'fixed inset-0 z-[95] flex items-center justify-center bg-canvas/97 backdrop-blur-sm',
        !isOpen && 'pointer-events-none'
      )}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close image"
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-canvas/80 text-ink transition-colors hover:bg-ink hover:text-canvas md:right-8 md:top-8"
      >
        <X size={20} />
      </button>

      <AnimatePresence mode="wait" key={openSession}>
        {active && (
          <motion.img
            key={activeIndex}
            src={withBasePath(active.src)}
            alt={active.alt}
            drag={total > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.4}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: prefersReducedMotion ? 0.01 : 0.3, ease: easeOut }}
            onClick={(e) => e.stopPropagation()}
            style={
              fittedSize
                ? { imageRendering, width: fittedSize.width, height: fittedSize.height }
                : { imageRendering, maxWidth: `${bounds.maxWidthVw}vw`, maxHeight: `${bounds.maxHeightVh}vh` }
            }
            className="touch-none object-contain"
          />
        )}
      </AnimatePresence>

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-canvas/60 text-ink backdrop-blur-sm transition-colors hover:bg-ink hover:text-canvas md:left-8"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            aria-label="Next image"
            className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-canvas/60 text-ink backdrop-blur-sm transition-colors hover:bg-ink hover:text-canvas md:right-8"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {active && (
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 md:bottom-10">
          <p className="max-w-[70vw] truncate font-mono text-[11px] tracking-wide text-muted">{active.filename}</p>
          {total > 1 && (
            <p className="num font-mono text-xs text-muted">
              {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
}
