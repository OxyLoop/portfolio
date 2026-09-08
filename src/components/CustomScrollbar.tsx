'use client';

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice';
import { setCursorSuppressed } from '@/lib/cursorSuppression';
import { cn } from '@/lib/utils';

interface CustomScrollbarProps {
  /** Scrollable element to track. Omit to track the window/page scroll. */
  containerRef?: RefObject<HTMLElement>;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
  /**
   * Interactive scrollbars (the default) support track click, thumb drag and
   * keyboard input, and suppress the site's custom cursor dot while hovered
   * so the native pointer/grab/grabbing cursor shows through instead of both
   * rendering at once. Pass `false` for a pure visual progress indicator —
   * the gallery filmstrip, which is meant to be driven by wheel/touch only —
   * with no pointer handling and no cursor suppression.
   */
  interactive?: boolean;
}

const THUMB_FRACTION = 0.16; // thumb length as a fraction of the track
const ARROW_STEP = 0.05; // 5% of the scrollable range per arrow key press
const PAGE_STEP = 0.2; // 20% per Page Up/Down

/**
 * Single shared scroll-progress indicator, reused for the page itself, the
 * project detail overlay's own scroll container, and the gallery's
 * horizontal filmstrip — pass `containerRef` to track anything other than
 * the window. When `interactive` (the default), it acts as a real scrollbar:
 * click the track to jump there, drag the thumb, or focus it and use
 * arrow/Page/Home/End keys — on top of staying in sync with ordinary
 * wheel/touch/keyboard scrolling. Hidden on touch devices, matching the
 * site's custom cursor.
 */
export default function CustomScrollbar({
  containerRef,
  orientation = 'vertical',
  className,
  interactive = true,
}: CustomScrollbarProps) {
  const isTouch = useIsTouchDevice();
  const prefersReducedMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [scrollable, setScrollable] = useState(false);
  const [dragging, setDragging] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const maxRef = useRef(0);
  const isHorizontal = orientation === 'horizontal';

  const readMetrics = useCallback(() => {
    const el = containerRef?.current;
    if (el) {
      const max = isHorizontal ? el.scrollWidth - el.clientWidth : el.scrollHeight - el.clientHeight;
      const current = isHorizontal ? el.scrollLeft : el.scrollTop;
      return { max, current };
    }
    const doc = document.documentElement;
    const max = isHorizontal ? doc.scrollWidth - window.innerWidth : doc.scrollHeight - window.innerHeight;
    const current = isHorizontal ? window.scrollX : window.scrollY;
    return { max, current };
  }, [containerRef, isHorizontal]);

  const update = useCallback(() => {
    const { max, current } = readMetrics();
    maxRef.current = max;
    setScrollable(max > 4);
    setProgress(max > 0 ? Math.min(1, Math.max(0, current / max)) : 0);
  }, [readMetrics]);

  useEffect(() => {
    if (isTouch) return;
    const el = containerRef?.current;
    const target: HTMLElement | Window = el ?? window;

    update();
    target.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    // Content (e.g. lazy-loaded gallery images) can change the scrollable
    // range after the last scroll event fired, leaving the cached ratio
    // stale until the user scrolls again. The container itself often has a
    // fixed size (e.g. the project overlay is pinned to the viewport), so
    // its own box never changes — it's the content inside that grows.
    // Observing every direct child catches that (each gallery image, or the
    // page's content wrapper) without needing to know the container's
    // internal structure.
    const ro = new ResizeObserver(update);
    const childTargets = el ? Array.from(el.children) : [document.body];
    childTargets.forEach((child) => ro.observe(child));

    return () => {
      target.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      ro.disconnect();
    };
  }, [containerRef, isTouch, update]);

  /**
   * Smoothly animates the tracked container to an absolute scroll offset —
   * used only for track clicks and keyboard steps, never for drag (see
   * `setScrollInstant` below for why those need a genuinely different code
   * path rather than just passing `behavior: 'auto'` here).
   */
  const scrollToValue = useCallback(
    (value: number) => {
      const behavior: ScrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';
      const options: ScrollToOptions = isHorizontal ? { left: value, behavior } : { top: value, behavior };
      const el = containerRef?.current;
      if (el) el.scrollTo(options);
      else window.scrollTo(options);
    },
    [containerRef, isHorizontal, prefersReducedMotion]
  );

  /**
   * Instantly sets the tracked container's scroll offset via direct
   * scrollTop/scrollLeft assignment rather than `scrollTo({behavior:'auto'})`.
   * This matters specifically for window-tracking: the page sets
   * `scroll-behavior: smooth` on <html> (for anchor-link jumps), and per the
   * CSSOM View spec, `behavior: 'auto'` passed to scrollTo/scrollBy defers to
   * that CSS property rather than forcing an instant jump — so every drag
   * frame was actually queuing a smooth-scroll animation instead of moving
   * immediately, producing a delayed "jump to the final spot on release"
   * instead of real-time tracking. Direct property assignment is unaffected
   * by scroll-behavior and is always instant, which is what dragging needs.
   */
  const setScrollInstant = useCallback(
    (value: number) => {
      const el = containerRef?.current;
      if (el) {
        if (isHorizontal) el.scrollLeft = value;
        else el.scrollTop = value;
      } else if (isHorizontal) {
        document.documentElement.scrollLeft = value;
      } else {
        document.documentElement.scrollTop = value;
      }
    },
    [containerRef, isHorizontal]
  );

  /**
   * Track clicks and keyboard steps trigger a *smooth* scroll — the thumb
   * should animate there in step with the real scroll position (via the
   * 'scroll' listener above), not jump to the target immediately. Jumping
   * ahead would visually disconnect the thumb from the page, which is still
   * smoothly catching up underneath it.
   */
  const seekToProgress = useCallback(
    (p: number) => {
      const clamped = Math.min(1, Math.max(0, p));
      scrollToValue(clamped * maxRef.current);
    },
    [scrollToValue]
  );

  /**
   * Dragging needs the thumb to track the pointer 1:1 in real time, so this
   * updates the displayed progress immediately alongside an instant scroll —
   * the two stay in sync because both happen synchronously on every pointer
   * move, with no animation in between to lag behind.
   */
  const dragToProgress = useCallback(
    (p: number) => {
      const clamped = Math.min(1, Math.max(0, p));
      setProgress(clamped);
      setScrollInstant(clamped * maxRef.current);
    },
    [setScrollInstant]
  );

  const progressFromClientPos = useCallback(
    (clientPos: number) => {
      const track = trackRef.current;
      if (!track) return 0;
      const rect = track.getBoundingClientRect();
      const pos = clientPos - (isHorizontal ? rect.left : rect.top);
      const size = isHorizontal ? rect.width : rect.height;
      return size > 0 ? pos / size : 0;
    },
    [isHorizontal]
  );

  // Clicking the track (not the thumb — its own handler stops propagation
  // before this ever fires) jumps to that position with a short, smooth
  // glide rather than an instant, harsh cut.
  const handleTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const clientPos = isHorizontal ? e.clientX : e.clientY;
    seekToProgress(progressFromClientPos(clientPos));
  };

  // Dragging the thumb tracks the pointer 1:1 — no smoothing, since easing
  // would make it lag behind the cursor instead of feeling directly held.
  const handleThumbPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  };

  const handleThumbPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const clientPos = isHorizontal ? e.clientX : e.clientY;
    dragToProgress(progressFromClientPos(clientPos));
  };

  /** Whether a client point falls within this instance's own hit area. */
  const isPointWithinWrapper = useCallback((clientX: number, clientY: number) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return false;
    const rect = wrapper.getBoundingClientRect();
    return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
  }, []);

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // already released (e.g. pointercancel) — nothing to do.
    }
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    // While captured, pointer boundary events (enter/leave) don't fire for
    // this element even if the cursor physically drifted outside it — so on
    // release, explicitly check where the pointer actually is rather than
    // assuming it's still hovering (which would leave the custom dot wrongly
    // suppressed) or that it left (which would show two cursors at once).
    setCursorSuppressed(isPointWithinWrapper(e.clientX, e.clientY));
  };

  const handleWrapperPointerEnter = () => setCursorSuppressed(true);
  const handleWrapperPointerLeave = () => setCursorSuppressed(false);

  // Guard against unmounting mid-hover/drag (e.g. the project overlay closes
  // while the pointer is still over its scrollbar) leaving the custom cursor
  // stuck hidden with nothing left to restore it.
  useEffect(() => {
    if (!interactive) return;
    return () => setCursorSuppressed(false);
  }, [interactive]);

  const handleTrackKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const forwardKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';
    const backwardKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';
    let next: number | null = null;

    if (e.key === forwardKey) next = progress + ARROW_STEP;
    else if (e.key === backwardKey) next = progress - ARROW_STEP;
    else if (e.key === 'PageDown') next = progress + PAGE_STEP;
    else if (e.key === 'PageUp') next = progress - PAGE_STEP;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = 1;

    if (next !== null) {
      e.preventDefault();
      seekToProgress(next);
    }
  };

  if (isTouch || !scrollable) return null;

  const travel = (1 - THUMB_FRACTION) * 100;

  return (
    <div
      ref={wrapperRef}
      onPointerEnter={interactive ? handleWrapperPointerEnter : undefined}
      onPointerLeave={interactive ? handleWrapperPointerLeave : undefined}
      className={cn(
        'group z-[65]',
        isHorizontal ? 'absolute inset-x-3 bottom-2 h-4 md:inset-x-4' : 'fixed right-4 top-24 bottom-10 w-4 md:right-6',
        className
      )}
    >
      {/* aria-controls is skipped deliberately: it would need an id on whatever
          this instance tracks, but that's often `window` itself (the homepage
          case), which has no id to reference. */}
      {/* eslint-disable jsx-a11y/role-has-required-aria-props */}
      <div
        ref={trackRef}
        role={interactive ? 'scrollbar' : 'progressbar'}
        aria-orientation={isHorizontal ? 'horizontal' : 'vertical'}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        aria-label={isHorizontal ? 'Gallery scroll position' : 'Page scroll position'}
        tabIndex={interactive ? 0 : -1}
        onPointerDown={interactive ? handleTrackPointerDown : undefined}
        onKeyDown={interactive ? handleTrackKeyDown : undefined}
        className={cn('relative h-full w-full outline-none', interactive ? 'cursor-pointer' : 'cursor-default')}
      >
        {/* eslint-enable jsx-a11y/role-has-required-aria-props */}
        {/* Visual track line — purely decorative, centered within the wider hit area above. */}
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute rounded-full bg-line/60 transition-colors duration-300 group-hover:bg-line group-focus-visible:bg-line',
            isHorizontal ? 'left-0 top-1/2 h-px w-full -translate-y-1/2' : 'left-1/2 top-0 h-full w-px -translate-x-1/2'
          )}
        />

        {/* Thumb hit area is wider than the visible bar so it's easy to grab
            with a mouse; the bar itself stays exactly as thin as before.
            Non-interactive instances render this purely as a visual layer —
            no pointer handlers, default cursor, nothing to grab. */}
        <div
          onPointerDown={interactive ? handleThumbPointerDown : undefined}
          onPointerMove={interactive ? handleThumbPointerMove : undefined}
          onPointerUp={interactive ? endDrag : undefined}
          onPointerCancel={interactive ? endDrag : undefined}
          className={cn(
            'absolute flex items-center justify-center',
            isHorizontal ? 'inset-y-0' : 'inset-x-0',
            interactive ? (dragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
          )}
          style={
            isHorizontal
              ? { width: `${THUMB_FRACTION * 100}%`, left: `${progress * travel}%` }
              : { height: `${THUMB_FRACTION * 100}%`, top: `${progress * travel}%` }
          }
        >
          <div
            aria-hidden="true"
            className={cn(
              'rounded-full bg-accent/70 group-hover:bg-accent',
              isHorizontal ? 'h-1 w-full' : 'h-full w-1',
              !prefersReducedMotion &&
                !dragging &&
                (isHorizontal
                  ? 'transition-[left,background-color] duration-150 ease-out'
                  : 'transition-[top,background-color] duration-150 ease-out')
            )}
          />
        </div>
      </div>
    </div>
  );
}
