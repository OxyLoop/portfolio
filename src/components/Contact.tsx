'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import { siteConfig } from '@/data/siteConfig';
import TechnicalLabel from '@/components/TechnicalLabel';

const easeOut = [0.16, 1, 0.3, 1] as const;

const socialLabels: Record<keyof typeof siteConfig.social, string> = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
};

const socialCursors: Record<keyof typeof siteConfig.social, string> = {
  github: 'SOURCE',
  linkedin: 'OPEN',
};

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable — the mailto link below still works.
    }
  };

  const socialEntries = Object.entries(siteConfig.social) as [keyof typeof siteConfig.social, string][];

  return (
    <section id="contact" className="relative bg-night px-6 py-28 text-ink md:px-10 md:py-40">
      <div className="mx-auto max-w-container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.6 }}
          className="mb-6 flex items-center gap-4"
        >
          <span className="font-mono text-sm text-accent">{'> contact'}</span>
          <span className="h-px flex-1 max-w-16 bg-line" aria-hidden="true" />
          <TechnicalLabel>
            {'STATUS '}
            <span className="text-accent">{'// AVAILABLE'}</span>
          </TechnicalLabel>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.8, ease: easeOut }}
          className="max-w-4xl text-display-lg font-semibold uppercase leading-[0.95] text-ink"
        >
          {siteConfig.contact.heading}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.7, ease: easeOut, delay: 0.15 }}
          className="mt-6 max-w-md text-lg text-ink/60"
        >
          {siteConfig.contact.sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.7, ease: easeOut, delay: 0.25 }}
          className="mt-14 flex flex-wrap items-center gap-4 md:mt-20"
        >
          <a
            href={`mailto:${siteConfig.email}`}
            data-cursor="VIEW"
            className="group flex items-center gap-3 border-b border-ink/30 pb-2 text-2xl text-ink transition-colors duration-300 hover:border-ink md:text-4xl"
          >
            {siteConfig.email}
            <ArrowUpRight className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" size={28} />
          </a>
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy email address"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/30 text-ink transition-colors hover:border-ink"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </motion.div>

        <div className="mt-20 grid grid-cols-2 gap-6 border-t border-ink/15 pt-10 sm:grid-cols-3 md:mt-28">
          {socialEntries.map(([key, url]) => {
            const label = socialLabels[key];
            const hasUrl = Boolean(url);
            return hasUrl ? (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor={socialCursors[key]}
                className="group flex items-center gap-1 text-sm uppercase tracking-widest2 text-ink/70 transition-colors hover:text-ink"
              >
                {label}
                <ArrowUpRight size={14} className="opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            ) : (
              <span
                key={key}
                title="Add this link in src/data/siteConfig.ts"
                className="text-sm uppercase tracking-widest2 text-ink/25"
              >
                {label}
              </span>
            );
          })}
          {siteConfig.resume ? (
            <a
              href={siteConfig.resume}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="OPEN"
              className="group flex items-center gap-1 text-sm uppercase tracking-widest2 text-ink/70 transition-colors hover:text-ink"
            >
              Resume
              <ArrowUpRight size={14} className="opacity-0 transition-opacity group-hover:opacity-100" />
            </a>
          ) : (
            <span
              title="Add your résumé link in src/data/siteConfig.ts"
              className="text-sm uppercase tracking-widest2 text-ink/25"
            >
              Resume
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
