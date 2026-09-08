'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { siteConfig } from '@/data/siteConfig';
import TerminalIntro from '@/components/TerminalIntro';

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [introDone, setIntroDone] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { damping: 40, stiffness: 120 });
  const springY = useSpring(my, { damping: 40, stiffness: 120 });

  const bgX = useTransform(springX, [-0.5, 0.5], ['-2%', '2%']);
  const bgY = useTransform(springY, [-0.5, 0.5], ['-2%', '2%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleScrollClick = () => {
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="top"
      ref={ref}
      onMouseMove={handleMouseMove}
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden px-6 pb-10 pt-32 md:px-10 md:pb-14"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #FFFFFF 1px, transparent 1px), linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <motion.div
        aria-hidden="true"
        style={{ x: prefersReducedMotion ? 0 : bgX, y: prefersReducedMotion ? 0 : bgY }}
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-1/2 h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full border border-line/70" />
        <div className="absolute left-1/2 top-1/2 h-[40vmax] w-[40vmax] -translate-x-1/2 -translate-y-1/2 rounded-full border border-line/50" />
      </motion.div>

      <div className="flex flex-1 flex-col justify-center">
        <AnimatePresence mode="wait">
          {!introDone ? (
            <motion.div key="terminal" exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <TerminalIntro onComplete={() => setIntroDone(true)} />
            </motion.div>
          ) : (
            <motion.div
              key="hero-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: easeOut }}
                className="mb-4 font-serif text-xl italic text-muted md:mb-6 md:text-2xl"
              >
                {siteConfig.role}
              </motion.p>

              <h1 className="overflow-hidden">
                <motion.span
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, ease: easeOut, delay: 0.1 }}
                  className="block text-display-xl font-semibold uppercase text-ink"
                >
                  {siteConfig.name}
                </motion.span>
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: easeOut, delay: 0.5 }}
                className="mt-8 max-w-md text-lg leading-relaxed text-muted md:mt-10 md:max-w-lg md:text-xl"
              >
                {siteConfig.tagline}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: easeOut, delay: 0.7 }}
                className="mt-6 font-mono text-xs uppercase tracking-widest2 text-muted/70 md:mt-8"
              >
                {siteConfig.secondaryAreas}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: easeOut, delay: 0.85 }}
                className="mt-8 flex items-center gap-6 md:mt-10"
              >
                <button
                  type="button"
                  onClick={handleScrollClick}
                  data-cursor="VIEW"
                  className="text-sm uppercase tracking-widest2 text-ink transition-colors hover:text-accent"
                >
                  View Projects
                </button>
                <a
                  href={siteConfig.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="SOURCE"
                  className="group inline-flex items-center gap-1.5 text-sm uppercase tracking-widest2 text-muted transition-colors hover:text-ink"
                >
                  GitHub
                  <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.button
        type="button"
        onClick={handleScrollClick}
        data-cursor="VIEW"
        initial={{ opacity: 0 }}
        animate={{ opacity: introDone ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        className="group flex items-center gap-3 self-start text-sm uppercase tracking-widest2 text-muted transition-colors hover:text-ink"
      >
        <span>Scroll to explore</span>
        <motion.span
          aria-hidden="true"
          animate={prefersReducedMotion ? {} : { y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          ↓
        </motion.span>
      </motion.button>
    </section>
  );
}
