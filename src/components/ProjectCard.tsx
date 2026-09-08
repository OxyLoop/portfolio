'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight, Play } from 'lucide-react';
import type { Project } from '@/types/project';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  index: number;
  onOpen: (id: string) => void;
}

const easeOut = [0.16, 1, 0.3, 1] as const;
const reveal = {
  initial: { opacity: 0, y: 48 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-12% 0px' },
  transition: { duration: 0.85, ease: easeOut },
};

function Thumb({
  project,
  className,
  sizes,
  src,
}: {
  project: Project;
  className?: string;
  sizes: string;
  /** Overrides `project.thumbnail` — used by the "duo" layout's second image. */
  src?: string;
}) {
  return (
    <div className={cn('group relative overflow-hidden bg-fog', className)}>
      <Image
        src={src ?? project.thumbnail}
        alt={project.title}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.04]"
      />
      {project.mediaType === 'video' && (
        <div className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-ink text-canvas shadow-sm">
          <Play size={15} fill="currentColor" className="ml-0.5" />
        </div>
      )}
    </div>
  );
}

function Meta({ project, index }: { project: Project; index: number }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline gap-3 font-mono text-xs uppercase tracking-widest2">
        <span className="num text-accent">{`PROJECT_${String(index).padStart(2, '0')}`}</span>
        <span className="h-px w-6 bg-line" />
        <span className="text-muted">{project.category}</span>
        {project.year && <span className="num text-muted">{project.year}</span>}
      </div>
      <p className="font-mono text-[11px] uppercase tracking-wide text-muted/70">
        <span className="text-subtle">STACK_</span> {project.technologies.slice(0, 3).join(' · ')}
      </p>
    </div>
  );
}

function ViewLink() {
  return (
    <span className="flex items-center gap-1.5 text-sm uppercase tracking-widest2 text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100">
      View project <ArrowUpRight size={16} />
    </span>
  );
}

function TitleRow({ project, size = 'md' }: { project: Project; size?: 'md' | 'lg' }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <h3
        className={cn(
          'font-semibold uppercase leading-[0.95] text-ink transition-colors duration-300 group-hover:text-accent',
          size === 'lg' ? 'text-display-lg' : 'text-display-md'
        )}
      >
        {project.title}
      </h3>
      <ViewLink />
    </div>
  );
}

export default function ProjectCard({ project, index, onOpen }: ProjectCardProps) {
  const commonProps = {
    role: 'button' as const,
    tabIndex: 0,
    'data-cursor': 'OPEN_',
    onClick: () => onOpen(project.id),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onOpen(project.id);
      }
    },
    'aria-label': `Open project: ${project.title}`,
  };

  switch (project.layout) {
    case 'offset-left':
      return (
        <motion.article {...reveal} {...commonProps} className="group grid cursor-pointer grid-cols-1 gap-8 focus:outline-none lg:grid-cols-12 lg:gap-6">
          <div className="order-2 flex flex-col justify-center gap-6 lg:order-1 lg:col-span-4">
            <Meta project={project} index={index} />
            <h3 className="text-display-md font-semibold uppercase leading-[0.95] text-ink transition-colors duration-300 group-hover:text-accent">
              {project.title}
            </h3>
            <p className="max-w-sm text-base leading-relaxed text-muted">{project.description}</p>
            <ViewLink />
          </div>
          <Thumb project={project} sizes="(min-width: 1024px) 58vw, 100vw" className="order-1 aspect-[4/5] lg:order-2 lg:col-span-8 lg:aspect-[16/10]" />
        </motion.article>
      );

    case 'offset-right':
      return (
        <motion.article {...reveal} {...commonProps} className="group grid cursor-pointer grid-cols-1 gap-8 focus:outline-none lg:grid-cols-12 lg:gap-6">
          <Thumb project={project} sizes="(min-width: 1024px) 58vw, 100vw" className="aspect-[4/5] lg:col-span-8 lg:aspect-[16/10]" />
          <div className="flex flex-col justify-center gap-6 lg:col-span-4">
            <Meta project={project} index={index} />
            <h3 className="text-display-md font-semibold uppercase leading-[0.95] text-ink transition-colors duration-300 group-hover:text-accent">
              {project.title}
            </h3>
            <p className="max-w-sm text-base leading-relaxed text-muted">{project.description}</p>
            <ViewLink />
          </div>
        </motion.article>
      );

    case 'immersive':
      return (
        <motion.article {...reveal} {...commonProps} className="group cursor-pointer focus:outline-none">
          <Thumb project={project} sizes="100vw" className="aspect-[3/4] w-full md:aspect-[16/9] lg:h-[88vh] lg:aspect-auto" />
          <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-col gap-4">
              <Meta project={project} index={index} />
              <h3 className="text-display-lg font-semibold uppercase leading-[0.9] text-ink transition-colors duration-300 group-hover:text-accent">
                {project.title}
              </h3>
            </div>
            <p className="max-w-sm text-base leading-relaxed text-muted">{project.description}</p>
          </div>
        </motion.article>
      );

    case 'duo':
      return (
        <motion.article {...reveal} {...commonProps} className="group cursor-pointer focus:outline-none">
          <div className="mb-6">
            <TitleRow project={project} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Thumb project={project} sizes="50vw" className="aspect-[3/4]" />
            <Thumb project={project} src={project.thumbnailSecondary ?? project.thumbnail} sizes="50vw" className="aspect-[3/4]" />
          </div>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
            <Meta project={project} index={index} />
            <p className="text-base leading-relaxed text-muted sm:max-w-sm sm:text-right">{project.description}</p>
          </div>
        </motion.article>
      );

    case 'landscape':
    default:
      return (
        <motion.article {...reveal} {...commonProps} className="group cursor-pointer focus:outline-none">
          <Thumb project={project} sizes="100vw" className="aspect-[16/9] w-full md:aspect-[21/9]" />
          <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-4">
              <Meta project={project} index={index} />
              <TitleRow project={project} size="lg" />
            </div>
            <p className="max-w-sm text-base leading-relaxed text-muted">{project.description}</p>
          </div>
        </motion.article>
      );
  }
}
