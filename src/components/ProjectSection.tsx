'use client';

import { projects } from '@/data/projects';
import ProjectCard from '@/components/ProjectCard';
import SectionTitle from '@/components/SectionTitle';

interface ProjectSectionProps {
  onOpenProject: (id: string) => void;
}

export default function ProjectSection({ onOpenProject }: ProjectSectionProps) {
  return (
    <section id="projects" className="relative px-6 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-container">
        <div className="mb-20 flex flex-col justify-between gap-8 md:mb-28 md:flex-row md:items-end">
          <SectionTitle index="01" eyebrow="Selected Projects" title="Engineering projects" />
          <p className="max-w-sm text-base leading-relaxed text-muted">
            A running collection of systems, tools and experiments — some shipped, some still evolving.
          </p>
        </div>

        <div className="flex flex-col gap-28 md:gap-40">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i + 1} onOpen={onOpenProject} />
          ))}
        </div>
      </div>
    </section>
  );
}
