'use client';

import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { siteConfig } from '@/data/siteConfig';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 40);
  });

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    const target = document.querySelector(href);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-soft',
          scrolled ? 'bg-canvas/75 backdrop-blur-lg border-b border-line' : 'bg-transparent border-b border-transparent'
        )}
      >
        <nav className="mx-auto flex max-w-container items-center justify-between px-6 py-5 md:px-10">
          <a
            href="#top"
            onClick={(e) => handleNavClick(e, '#top')}
            data-cursor="VIEW"
            className="font-sans text-sm font-semibold uppercase tracking-widest2 text-ink"
          >
            {siteConfig.shortName}
          </a>

          <ul className="hidden items-center gap-6 lg:gap-9 md:flex">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="group flex items-center text-sm uppercase tracking-widest2 text-ink/80 transition-colors duration-300 hover:text-ink"
                >
                  <span
                    aria-hidden="true"
                    className="w-0 overflow-hidden font-mono text-accent opacity-0 transition-all duration-200 group-hover:mr-1 group-hover:w-[0.6em] group-hover:opacity-100"
                  >
                    {'>'}
                  </span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="p-1 text-ink md:hidden"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-10 bg-canvas md:hidden"
          >
            {siteConfig.nav.map((item, i) => (
              <motion.a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl uppercase tracking-widest2 text-ink"
              >
                {item.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
