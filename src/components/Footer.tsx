import { siteConfig } from '@/data/siteConfig';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-night px-6 py-8 text-ink/50 md:px-10">
      <div className="mx-auto flex max-w-container flex-col gap-2 text-xs uppercase tracking-widest2 sm:flex-row sm:items-center sm:justify-between">
        <p>
          {siteConfig.name} · {siteConfig.role} · © {year}
        </p>
        <p className="font-mono text-[11px] text-subtle">{`BUILD // ${year}`}</p>
      </div>
    </footer>
  );
}
