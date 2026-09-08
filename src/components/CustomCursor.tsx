'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion, AnimatePresence } from 'framer-motion';
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice';
import { getCursorSuppressed, subscribeCursorSuppressed } from '@/lib/cursorSuppression';

const getSuppressedServerSnapshot = () => false;

/**
 * Minimal desktop-only cursor. It is purely additive: pointer-events are
 * disabled on it, the native cursor is never removed until this component
 * has mounted and confirmed a fine pointer, and any failure here simply
 * means the native cursor stays visible — the site remains fully usable.
 */
export default function CustomCursor() {
  const isTouch = useIsTouchDevice();
  const prefersReducedMotion = useReducedMotion();
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const suppressed = useSyncExternalStore(subscribeCursorSuppressed, getCursorSuppressed, getSuppressedServerSnapshot);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springConfig = { damping: 30, stiffness: 350, mass: 0.4 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useEffect(() => {
    if (isTouch) return;

    document.body.classList.add('custom-cursor-active');

    const handleMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);

      const target = (e.target as HTMLElement)?.closest?.('[data-cursor]');
      setLabel(target?.getAttribute('data-cursor') ?? null);
    };

    const handleLeave = () => setVisible(false);

    window.addEventListener('mousemove', handleMove);
    document.documentElement.addEventListener('mouseleave', handleLeave);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', handleMove);
      document.documentElement.removeEventListener('mouseleave', handleLeave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[100] flex items-center justify-center rounded-full mix-blend-difference"
      style={{
        x: prefersReducedMotion ? x : springX,
        y: prefersReducedMotion ? y : springY,
        translateX: '-50%',
        translateY: '-50%',
      }}
      animate={{
        width: label ? 84 : 8,
        height: label ? 84 : 8,
        opacity: visible && !suppressed ? 1 : 0,
        backgroundColor: '#F5F5F5',
      }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <AnimatePresence>
        {label && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            // Always dark: the badge itself is a fixed light color regardless
            // of theme, so its label text needs fixed dark contrast, not the
            // theme's `ink` token (which is light in this dark theme).
            className="text-[11px] font-medium uppercase tracking-widest2 text-[#0A0A0A]"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
