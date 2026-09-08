'use client';

import { motion } from 'framer-motion';
import { skills } from '@/data/skills';
import SectionTitle from '@/components/SectionTitle';

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function Skills() {
  return (
    <section id="skills" className="relative border-t border-line px-6 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-container">
        <SectionTitle index="02" eyebrow="Skills" title="Languages & tools" />

        <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 md:mt-24 lg:grid-cols-3">
          {skills.map((group, i) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.6, ease: easeOut, delay: (i % 3) * 0.08 }}
              className="border-t border-line pt-5"
            >
              <h3 className="mb-4 flex items-baseline gap-2 font-mono text-xs uppercase tracking-widest2">
                <span className="num text-accent">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-muted">{group.category}</span>
              </h3>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item} className="rounded-full border border-line px-3 py-1.5 text-xs uppercase tracking-wide text-ink">
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
