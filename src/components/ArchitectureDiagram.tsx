interface ArchitectureDiagramProps {
  diagram: string;
}

/** Renders a free-form ASCII/text architecture sketch in a monospace block. */
export default function ArchitectureDiagram({ diagram }: ArchitectureDiagramProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-fog/60 px-6 py-8 md:px-10">
      <pre className="whitespace-pre text-center font-mono text-xs leading-relaxed text-ink/80 md:text-sm">
        {diagram}
      </pre>
    </div>
  );
}
