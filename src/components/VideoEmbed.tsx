'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import type { Project } from '@/types/project';
import { detectVideoKind, getVimeoId, getYouTubeId, withBasePath } from '@/lib/utils';

interface VideoEmbedProps {
  project: Project;
}

/**
 * Lazy facade: renders only a poster + play button until clicked, so
 * homepage/detail views never load an iframe or video file up front.
 * Falls back to a plain poster image when no videoUrl is set yet.
 */
export default function VideoEmbed({ project }: VideoEmbedProps) {
  const [playing, setPlaying] = useState(false);
  const url = project.videoUrl ?? '';
  const kind = detectVideoKind(url);

  if (!url || kind === 'unknown') {
    return (
      <div className="relative aspect-video w-full overflow-hidden bg-fog">
        <Image src={project.thumbnail} alt={project.title} fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 flex items-center justify-center bg-night/20">
          <p className="rounded-full bg-ink/90 px-4 py-2 text-xs uppercase tracking-widest2 text-canvas">
            Video coming soon
          </p>
        </div>
      </div>
    );
  }

  if (!playing) {
    return (
      <button
        type="button"
        onClick={() => setPlaying(true)}
        aria-label={`Play video: ${project.title}`}
        data-cursor="PLAY"
        className="group relative block aspect-video w-full overflow-hidden bg-night"
      >
        <Image
          src={project.thumbnail}
          alt={project.title}
          fill
          sizes="100vw"
          className="object-cover opacity-90 transition-opacity duration-500 group-hover:opacity-70"
        />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ink transition-transform duration-300 group-hover:scale-110">
            <Play size={22} fill="currentColor" className="ml-1 text-canvas" />
          </span>
        </span>
      </button>
    );
  }

  if (kind === 'youtube') {
    const id = getYouTubeId(url);
    return (
      <div className="aspect-video w-full overflow-hidden bg-night">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={project.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    );
  }

  if (kind === 'vimeo') {
    const id = getVimeoId(url);
    return (
      <div className="aspect-video w-full overflow-hidden bg-night">
        <iframe
          src={`https://player.vimeo.com/video/${id}?autoplay=1`}
          title={project.title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    );
  }

  return (
    <div className="aspect-video w-full overflow-hidden bg-night">
      <video
        src={withBasePath(url)}
        poster={withBasePath(project.thumbnail)}
        controls
        autoPlay
        playsInline
        className="h-full w-full object-cover"
      />
    </div>
  );
}
