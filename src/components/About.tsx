'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { siteConfig } from '@/data/siteConfig';
import { certificates } from '@/data/certificates';
import SectionTitle from '@/components/SectionTitle';

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function About() {
  const { about } = siteConfig;

  return (
    <section id="about" className="relative border-t border-line px-6 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-container">
        <SectionTitle index="04" eyebrow={about.eyebrow} title={about.heading} />

        <div className="mt-16 grid grid-cols-1 gap-12 md:mt-24 md:grid-cols-12 md:gap-10">
          <motion.div
            initial={{ opacity: 0, clipPath: 'inset(8% 8% 8% 8%)' }}
            whileInView={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.9, ease: easeOut }}
            className="relative aspect-[4/5] w-full overflow-hidden bg-fog md:col-span-4"
          >
            <Image src={about.portrait} alt={`Portrait of ${siteConfig.name}`} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.8, ease: easeOut, delay: 0.15 }}
            className="flex flex-col gap-10 md:col-span-8"
          >
            <p className="max-w-2xl text-xl leading-relaxed text-ink md:text-2xl">{about.bio}</p>

            <p className="max-w-lg font-serif text-2xl italic text-muted">&ldquo;{about.personalityLine}&rdquo;</p>

            <div>
              <h3 className="mb-2 font-mono text-xs uppercase tracking-widest2 text-muted">Education</h3>
              <p className="text-base text-ink">{about.education.school}</p>
              <p className="text-sm text-muted">
                {about.education.degree} · {about.education.period}
              </p>
              <p className="mt-2 font-mono text-xs uppercase tracking-wide text-muted/70">{about.education.meta}</p>
              <ul className="mt-3 flex flex-col gap-1.5">
                {about.education.honors.map((honor) => (
                  <li key={honor} className="flex gap-3 text-sm leading-relaxed text-ink/80">
                    <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    {honor}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-2 font-mono text-xs uppercase tracking-widest2 text-muted">Languages</h3>
              <p className="text-sm text-ink">{about.languages}</p>
            </div>

            <div>
              <h3 className="mb-3 font-mono text-xs uppercase tracking-widest2 text-muted">Soft skills</h3>
              <ul className="flex flex-wrap gap-2">
                {about.softSkills.map((item) => (
                  <li key={item} className="rounded-full border border-line px-3 py-1.5 text-xs uppercase tracking-wide text-ink">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-3 font-mono text-xs uppercase tracking-widest2 text-muted">Certificates</h3>
              <ul className="flex flex-col gap-2">
                {certificates.map((cert) =>
                  cert.url ? (
                    <li key={cert.title}>
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="VIEW"
                        className="group inline-flex items-center gap-1.5 text-sm text-ink/80 underline decoration-line underline-offset-4 transition-colors hover:decoration-accent"
                      >
                        {cert.title}
                        <ArrowUpRight size={13} className="opacity-0 transition-opacity group-hover:opacity-100" />
                      </a>
                    </li>
                  ) : (
                    <li key={cert.title} className="text-sm text-ink/80">
                      {cert.title}
                      {cert.status && <span className="text-muted"> — {cert.status}</span>}
                    </li>
                  )
                )}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
