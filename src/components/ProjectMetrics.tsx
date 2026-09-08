import type { ProjectMetric } from '@/types/project';

interface ProjectMetricsProps {
  metrics: ProjectMetric[];
}

export default function ProjectMetrics({ metrics }: ProjectMetricsProps) {
  return (
    <div className="flex flex-wrap gap-x-10 gap-y-6">
      {metrics.map((metric) => (
        <div key={metric.label}>
          <p className="num text-display-md font-semibold text-ink">{metric.value}</p>
          <p className="mt-1 text-xs uppercase tracking-widest2 text-muted">{metric.label}</p>
        </div>
      ))}
    </div>
  );
}
