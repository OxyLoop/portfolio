'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { GalleryEntry } from '@/types/project';
import { normalizeGalleryItems, withBasePath } from '@/lib/utils';
import ProjectLightbox from '@/components/ProjectLightbox';
import CustomScrollbar from '@/components/CustomScrollbar';

interface ProjectGalleryProps {
  images: GalleryEntry[];
  title: string;
}

const easeOut = [0.16, 1, 0.3, 1] as const;

/**
 * Horizontal, snap-scrolling filmstrip. Plain <img> (not next/image) is used
 * deliberately here since gallery images keep their native aspect ratio
 * (mixed portrait/landscape) — each is lazy-loaded so opening a project
 * never pulls every gallery image at once. Clicking an image opens it in
 * ProjectLightbox; each thumbnail reveals with a soft upward drift as it
 * scrolls into view, using the gallery's own scroll container as the
 * IntersectionObserver root so the effect is aware of horizontal scroll
 * (the default viewport root would fire for every image at once, since
 * off-screen thumbnails are only clipped by overflow, not actually removed
 * from the layout).
 *
 * A plain vertical mouse wheel does nothing on a horizontally-overflowing
 * element by default (only trackpad horizontal swipes or shift+wheel do),
 * so a mouse user has no way to move the filmstrip at all. A native
 * (non-passive) wheel listener redirects vertical scroll into horizontal
 * movement here, and visible arrow buttons cover the rest for discoverability.
 */
export default function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const items = useMemo(
    () => normalizeGalleryItems(images, (i) => `${title} — gallery image ${i + 1}`),
    [images, title]
  );

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return; // already scrolling horizontally (trackpad) — leave it alone
      if (el.scrollWidth <= el.clientWidth) return; // nothing to scroll

      // Only take over the wheel event while the gallery can actually move
      // further in the requested direction. At either end, let it fall
      // through to the page's normal scroll instead of trapping it here —
      // otherwise reaching the last image would leave the wheel unable to
      // scroll the rest of the project page.
      const maxScrollLeft = el.scrollWidth - el.clientWidth;
      const atStart = el.scrollLeft <= 0;
      const atEnd = el.scrollLeft >= maxScrollLeft - 1;
      if ((e.deltaY > 0 && atEnd) || (e.deltaY < 0 && atStart)) return;

      e.preventDefault();
      // scrollBy (rather than mutating scrollLeft directly) goes through the
      // browser's normal scroll pipeline, so it resolves correctly against
      // this container's scroll-snap instead of being fought/reset by it.
      el.scrollBy({ left: e.deltaY });
    };

    // React attaches onWheel as a passive listener, which silently ignores
    // preventDefault — a native listener is required to actually redirect
    // the scroll axis instead of also scrolling the page underneath.
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  if (items.length === 0) return null;

  const scrollByAmount = (direction: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: direction * 360 });
  };

  return (
    <div className="group/gallery relative">
      <div
        ref={scrollerRef}
        tabIndex={0}
        role="region"
        aria-label={`${title} gallery`}
        className="no-native-scrollbar flex snap-x snap-proximity gap-4 overflow-x-auto pb-4"
      >
        {items.map((item, i) => (
          <motion.div
            key={item.src}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24, scale: 0.985 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ root: scrollerRef, once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: easeOut }}
            className="group inline-flex flex-shrink-0 snap-start flex-col items-start gap-3 text-left"
          >
            {/* Only the image is clickable — the filename below is a label,
                not part of the interactive/VIEW-cursor target. */}
            <button
              type="button"
              onClick={() => setLightboxIndex(i)}
              data-cursor="VIEW"
              aria-label={`Open ${item.filename} — image ${i + 1} of ${items.length}`}
              className="block h-[45vh] overflow-hidden bg-fog md:h-[65vh]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- intrinsic aspect ratio varies per image; next/image needs fixed dimensions */}
              <img
                src={withBasePath(item.src)}
                alt={item.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-auto object-contain transition-[transform,filter] duration-500 ease-premium hover:scale-[1.012] hover:brightness-105"
              />
            </button>
            {/* File-label style caption, not a photo caption — monospace,
                natural case, in the site's muted technical green; brightens
                to full opacity when hovering the image above. */}
            <p className="w-full truncate font-mono text-[13px] font-medium tracking-wide text-accent/80 transition-colors duration-300 group-hover:text-accent md:text-[15px]">
              {item.filename}
            </p>
          </motion.div>
        ))}
      </div>

      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => scrollByAmount(-1)}
            aria-label="Scroll gallery left"
            className="absolute left-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-canvas/80 text-ink opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover/gallery:opacity-100 md:flex"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scrollByAmount(1)}
            aria-label="Scroll gallery right"
            className="absolute right-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-canvas/80 text-ink opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover/gallery:opacity-100 md:flex"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* Visual-only: wheel/trackpad/touch drive gallery navigation, this is
          purely a progress indicator (see CustomScrollbar's `interactive` prop). */}
      <CustomScrollbar containerRef={scrollerRef} orientation="horizontal" interactive={false} />

      <ProjectLightbox
        items={items}
        title={title}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </div>
  );
}
