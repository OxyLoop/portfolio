'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight, Github, X } from 'lucide-react';
import type { Project } from '@/types/project';
import { cn } from '@/lib/utils';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { projects } from '@/data/projects';
import CustomScrollbar from '@/components/CustomScrollbar';
import VideoEmbed from '@/components/VideoEmbed';
import ProjectGallery from '@/components/ProjectGallery';
import AssetShowcase from '@/components/AssetShowcase';
import ArchitectureDiagram from '@/components/ArchitectureDiagram';
import ProjectMetrics from '@/components/ProjectMetrics';

interface ProjectDetailProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

const easeOut = [0.16, 1, 0.3, 1] as const;

/**
 * Visibility (pointer-events, focus, scroll lock) is driven directly by the
 * `isOpen` boolean rather than by waiting for the exit animation to finish
 * and unmount — that indirection is what leaves a real modal invisible-but-
 * still-blocking-clicks if an exit animation ever gets interrupted or
 * throttled (e.g. a backgrounded tab). The component stays mounted and
 * simply fades/slides based on state, so correctness never depends on
 * animation timing.
 */
export default function ProjectDetail({ project, isOpen, onClose }: ProjectDetailProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useLockBodyScroll(isOpen);

  const projectIndex = projects.findIndex((p) => p.id === project.id) + 1;

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    // Set as a real DOM property rather than a JSX prop: React's HTML
    // attribute whitelist doesn't yet treat `inert` as boolean, so passing
    // it directly renders `inert="true"`/warns instead of toggling cleanly.
    if (dialogRef.current) dialogRef.current.inert = !isOpen;
  }, [isOpen]);

  // There's only ever one ProjectDetail instance — opening a different
  // project just swaps `project` on the same mounted overlay rather than
  // mounting a fresh one, so its scroll container otherwise keeps whatever
  // scrollTop was left over from whichever project was viewed last (e.g.
  // scrolled to the bottom). Reset to the top on every fresh open and on
  // switching projects, but not on close — resetting mid-close-fade would
  // visibly jump the still-fading-out content.
  useEffect(() => {
    if (!isOpen || !dialogRef.current) return;
    dialogRef.current.scrollTop = 0;
  }, [isOpen, project.id]);

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
      aria-label={`${project.title} — project details`}
      initial={false}
      animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : '4%' }}
      transition={{ duration: 0.4, ease: easeOut }}
      className={cn(
        'no-native-scrollbar fixed inset-0 z-[80] overflow-y-auto bg-canvas',
        !isOpen && 'pointer-events-none'
      )}
    >
      <CustomScrollbar containerRef={dialogRef} />

      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-canvas/95 px-6 py-5 backdrop-blur-sm md:px-10">
        <button
          type="button"
          onClick={onClose}
          aria-label="Back to projects"
          className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest2 text-muted transition-all duration-200 hover:-translate-x-1 hover:text-ink"
        >
          ← Back
        </button>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close project details"
          data-cursor="CLOSE"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink transition-colors hover:bg-ink hover:text-canvas"
        >
          <X size={18} />
        </button>
      </div>

      <div className="mx-auto max-w-container px-6 py-14 md:px-10 md:py-20">
        <span className="num font-mono text-xs uppercase tracking-widest2 text-accent">
          {`PROJECT_${String(projectIndex).padStart(2, '0')}`}
        </span>

        <h2 className="mt-3 max-w-4xl text-display-lg font-semibold uppercase leading-[0.92] text-ink">
          {project.title}
        </h2>

        <p className="mt-4 font-mono text-xs uppercase tracking-widest2 text-muted">
          {project.category}
          {project.year ? ` · ${project.year}` : ''}
          {project.status ? ` · ${project.status}` : ''}
        </p>

        {project.technologies.length > 0 && (
          <p className="mt-3 font-mono text-sm text-muted">{project.technologies.join(' · ')}</p>
        )}

        <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">{project.description}</p>

        <div className="mt-14 md:mt-20">
          {project.mediaType === 'video' ? (
            <VideoEmbed project={project} />
          ) : (
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-fog">
              <Image
                src={project.detailImage ?? project.thumbnail}
                alt={project.title}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
            </div>
          )}
        </div>

        {(project.github || project.liveDemo) && (
          <div className="mt-8 flex flex-wrap items-center gap-6">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="SOURCE"
                className="inline-flex items-center gap-2 text-sm uppercase tracking-widest2 text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-accent"
              >
                <Github size={16} /> View Source <ArrowUpRight size={16} />
              </a>
            )}
            {project.liveDemo && (
              <a
                href={project.liveDemo}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="OPEN"
                className="inline-flex items-center gap-2 text-sm uppercase tracking-widest2 text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-accent"
              >
                Live Demo <ArrowUpRight size={16} />
              </a>
            )}
          </div>
        )}

        <div className="mt-16 grid grid-cols-1 gap-12 md:mt-24 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-8">
            <h3 className="mb-4 font-mono text-xs uppercase tracking-widest2 text-muted">Overview</h3>
            <p className="max-w-2xl whitespace-pre-line text-base leading-relaxed text-ink/90 md:text-lg">
              {project.longDescription}
            </p>
          </div>

          <div className="md:col-span-4">
            <h3 className="mb-3 font-mono text-xs uppercase tracking-widest2 text-muted">STACK_</h3>
            <ul className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border border-line px-3 py-1.5 text-xs uppercase tracking-wide text-ink"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {(project.problem || project.solution) && (
          <div className="mt-16 grid grid-cols-1 gap-12 border-t border-line pt-16 md:mt-24 md:grid-cols-2 md:gap-16 md:pt-24">
            {project.problem && (
              <div>
                <h3 className="mb-4 font-mono text-xs uppercase tracking-widest2 text-muted">Problem</h3>
                <p className="max-w-lg text-base leading-relaxed text-ink/90 md:text-lg">{project.problem}</p>
              </div>
            )}
            {project.solution && (
              <div>
                <h3 className="mb-4 font-mono text-xs uppercase tracking-widest2 text-muted">Solution</h3>
                <p className="max-w-lg text-base leading-relaxed text-ink/90 md:text-lg">{project.solution}</p>
              </div>
            )}
          </div>
        )}

        {project.architecture && (
          <div className="mt-16 border-t border-line pt-16 md:mt-24 md:pt-24">
            <h3 className="mb-6 font-mono text-xs uppercase tracking-widest2 text-muted">Architecture</h3>
            <ArchitectureDiagram diagram={project.architecture} />
          </div>
        )}

        {project.challenges && project.challenges.length > 0 && (
          <div className="mt-16 border-t border-line pt-16 md:mt-24 md:pt-24">
            <h3 className="mb-6 font-mono text-xs uppercase tracking-widest2 text-muted">Challenges</h3>
            <ul className="flex max-w-2xl flex-col gap-4">
              {project.challenges.map((challenge) => (
                <li key={challenge} className="flex gap-4 text-base leading-relaxed text-ink/90 md:text-lg">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  {challenge}
                </li>
              ))}
            </ul>
          </div>
        )}

        {project.highlights && project.highlights.length > 0 && (
          <div className="mt-16 border-t border-line pt-16 md:mt-24 md:pt-24">
            <h3 className="mb-6 font-mono text-xs uppercase tracking-widest2 text-muted">Highlights</h3>
            <ul className="flex max-w-2xl flex-col gap-2">
              {project.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-3 text-base leading-relaxed text-ink/90 md:text-lg">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        )}

        {project.outcome && (
          <div className="mt-16 border-t border-line pt-16 md:mt-24 md:pt-24">
            <h3 className="mb-4 font-mono text-xs uppercase tracking-widest2 text-muted">Outcome</h3>
            <p className="max-w-2xl text-base leading-relaxed text-ink/90 md:text-lg">{project.outcome}</p>
          </div>
        )}

        {project.metrics && project.metrics.length > 0 && (
          <div className="mt-16 border-t border-line pt-16 md:mt-24 md:pt-24">
            <h3 className="mb-6 font-mono text-xs uppercase tracking-widest2 text-muted">Metrics</h3>
            <ProjectMetrics metrics={project.metrics} />
          </div>
        )}

        {project.assetShowcase && (
          <div className="mt-16 border-t border-line pt-16 md:mt-24 md:pt-24">
            <h3 className="mb-4 font-mono text-xs uppercase tracking-widest2 text-muted">{project.assetShowcase.title}</h3>
            <p className="max-w-lg text-base leading-relaxed text-ink/90 md:text-lg">{project.assetShowcase.description}</p>
            <div className="mt-8">
              <AssetShowcase items={project.assetShowcase.items} title={project.assetShowcase.title} />
            </div>
          </div>
        )}

        {project.gallery.length > 0 && (
          <div className="mt-16 border-t border-line pt-16 md:mt-24 md:pt-24">
            <h3 className="mb-6 font-mono text-xs uppercase tracking-widest2 text-muted">Gallery</h3>
            <ProjectGallery images={project.gallery} title={project.title} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
