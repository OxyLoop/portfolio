'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionTitleProps {
  index: string;
  eyebrow: string;
  title: string;
  align?: 'left' | 'center';
  tone?: 'light' | 'dark';
}

export default function SectionTitle({ index, eyebrow, title, align = 'left', tone = 'light' }: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={cn('flex flex-col gap-3', align === 'center' && 'items-center text-center')}
    >
      <span
        className={cn(
          'font-mono text-xs uppercase tracking-widest2 num',
          tone === 'dark' ? 'text-ink/50' : 'text-muted'
        )}
      >
        {index} — {eyebrow}
      </span>
      <h2 className="text-display-md font-semibold uppercase text-ink">
        {title}
      </h2>
    </motion.div>
  );
}
