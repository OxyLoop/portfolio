'use client';

import { motion } from 'framer-motion';
import { experience } from '@/data/experience';
import SectionTitle from '@/components/SectionTitle';
import { cn } from '@/lib/utils';

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function Experience() {
  return (
    <section id="experience" className="relative border-t border-line px-6 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-container">
        <SectionTitle index="03" eyebrow="Experience" title="Where I've worked" />

        <div className="mt-16 flex flex-col md:mt-24">
          {experience.map((entry, i) => (
            <motion.div
              key={`${entry.company}-${entry.period}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.7, ease: easeOut, delay: i * 0.06 }}
              className={cn(
                'grid grid-cols-1 gap-4 pb-10 md:grid-cols-12 md:gap-8 md:pb-12',
                i > 0 && 'border-t border-line pt-10 md:pt-12'
              )}
            >
              <p className="num flex items-center gap-2 font-mono text-xs uppercase tracking-widest2 text-muted md:col-span-3">
                <span className="text-accent" aria-hidden="true">●</span>
                {entry.period}
              </p>
              <div className="md:col-span-9">
                <h3 className="text-xl font-semibold text-ink md:text-2xl">{entry.role}</h3>
                <p className="mt-1 text-base text-muted">{entry.company}</p>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink/90">{entry.description}</p>
                {entry.stack && entry.stack.length > 0 && (
                  <p className="mt-4 font-mono text-xs uppercase tracking-wide text-muted/70">
                    {entry.stack.join(' / ')}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
