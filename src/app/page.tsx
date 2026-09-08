'use client';

import { useCallback, useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import CustomScrollbar from '@/components/CustomScrollbar';
import Hero from '@/components/Hero';
import ProjectSection from '@/components/ProjectSection';
import Skills from '@/components/Skills';
import Experience from '@/components/Experience';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import ProjectDetail from '@/components/ProjectDetail';
import { projects } from '@/data/projects';

const PROJECT_HASH_PREFIX = '#project/';

if (projects.length === 0) {
  throw new Error('projects.ts must contain at least one project');
}
const firstProject = projects[0]!;

export default function Home() {
  const [openProjectId, setOpenProjectId] = useState<string | null>(null);
  // Keep rendering the last-open project while the overlay fades out, so it
  // doesn't flash empty mid-close animation.
  const [lastProject, setLastProject] = useState(firstProject);

  const openProject = useCallback((id: string) => {
    setOpenProjectId(id);
    window.history.pushState(null, '', `${PROJECT_HASH_PREFIX}${id}`);
  }, []);

  const closeProject = useCallback(() => {
    setOpenProjectId(null);
    window.history.pushState(null, '', window.location.pathname);
  }, []);

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith(PROJECT_HASH_PREFIX)) {
        const id = hash.slice(PROJECT_HASH_PREFIX.length);
        setOpenProjectId(projects.some((p) => p.id === id) ? id : null);
      } else {
        setOpenProjectId(null);
      }
    };

    syncFromHash();
    window.addEventListener('popstate', syncFromHash);
    window.addEventListener('hashchange', syncFromHash);
    return () => {
      window.removeEventListener('popstate', syncFromHash);
      window.removeEventListener('hashchange', syncFromHash);
    };
  }, []);

  const isDetailOpen = openProjectId !== null;
  const activeProject = projects.find((p) => p.id === openProjectId);
  useEffect(() => {
    if (activeProject) setLastProject(activeProject);
  }, [activeProject]);

  return (
    <>
      <Navbar />
      <CustomScrollbar />
      <main>
        <Hero />
        <ProjectSection onOpenProject={openProject} />
        <Skills />
        <Experience />
        <About />
        <Contact />
      </main>
      <Footer />

      <ProjectDetail project={lastProject} isOpen={isDetailOpen} onClose={closeProject} />
    </>
  );
}
