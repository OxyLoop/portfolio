'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { siteConfig } from '@/data/siteConfig';
import BlinkingCursor from '@/components/BlinkingCursor';

interface TerminalIntroProps {
  onComplete: () => void;
}

const SESSION_KEY = 'portfolio-intro-shown';
const COMMAND = '$ ./portfolio';

/**
 * Runs the full ~3.5s typing sequence once per browser session (tracked via
 * sessionStorage — a static-export-friendly, purely client-side check).
 * Repeat visits within the same session, and prefers-reduced-motion, get
 * every line instantly instead of typed character-by-character.
 */
export default function TerminalIntro({ onComplete }: TerminalIntroProps) {
  const prefersReducedMotion = useReducedMotion();
  const [mode, setMode] = useState<'full' | 'quick' | null>(null);
  const [typed, setTyped] = useState('');
  const [lineCount, setLineCount] = useState(0);
  const doneRef = useRef(false);

  const outputLines = [
    'Initializing profile...',
    `name: ${siteConfig.name}`,
    `role: ${siteConfig.role}`,
    `focus: ${siteConfig.secondaryAreas}`,
    'READY_',
  ];

  const resolvedRef = useRef(false);

  useEffect(() => {
    // Guard against React StrictMode's dev-only double-invoke: this effect
    // both reads and writes sessionStorage, so running it twice would have
    // the second pass see the first pass's own write and wrongly conclude
    // "already seen" on every single load.
    if (resolvedRef.current) return;
    resolvedRef.current = true;

    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === '1';
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      // sessionStorage unavailable (e.g. private browsing) — treat as first visit.
    }
    setMode(prefersReducedMotion || seen ? 'quick' : 'full');
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (mode === null) return;

    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      onComplete();
    };

    if (mode === 'quick') {
      setTyped(COMMAND);
      setLineCount(outputLines.length);
      const t = setTimeout(finish, 350);
      return () => clearTimeout(t);
    }

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    let typeInterval: ReturnType<typeof setInterval> | undefined;

    timeouts.push(
      setTimeout(() => {
        let i = 0;
        typeInterval = setInterval(() => {
          i += 1;
          setTyped(COMMAND.slice(0, i));
          if (i >= COMMAND.length && typeInterval) clearInterval(typeInterval);
        }, 32);
      }, 300)
    );

    [1100, 1700, 2200, 2700, 3300].forEach((delay, i) => {
      timeouts.push(setTimeout(() => setLineCount(i + 1), delay));
    });

    timeouts.push(setTimeout(finish, 3750));

    return () => {
      timeouts.forEach(clearTimeout);
      if (typeInterval) clearInterval(typeInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // Stable layout slot while the mode (session/reduced-motion) is being
  // resolved client-side — identical on server and first client paint, so
  // there is no hydration mismatch, just a brief, silent placeholder.
  if (mode === null) return <div className="min-h-[7rem] md:min-h-[8rem]" aria-hidden="true" />;

  return (
    <div className="mb-6 flex min-h-[7rem] flex-col gap-1 font-mono text-xs text-muted md:mb-8 md:min-h-[8rem] md:text-sm" aria-hidden="true">
      <div className="flex items-center gap-1 text-ink">
        <span>{typed}</span>
        <BlinkingCursor />
      </div>
      {outputLines.slice(0, lineCount).map((line, i) => (
        <motion.div
          key={line}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: mode === 'quick' ? 0.15 : 0.3 }}
          className={i === outputLines.length - 1 ? 'text-accent' : undefined}
        >
          {line}
        </motion.div>
      ))}
    </div>
  );
}
