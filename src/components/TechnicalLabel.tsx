import { cn } from '@/lib/utils';

interface TechnicalLabelProps {
  children: React.ReactNode;
  className?: string;
  tone?: 'muted' | 'accent';
}

/** Small monospace system-readout label, e.g. `STATUS // AVAILABLE`. Used sparingly. */
export default function TechnicalLabel({ children, className, tone = 'muted' }: TechnicalLabelProps) {
  return (
    <span
      className={cn(
        'font-mono text-[11px] uppercase tracking-widest2',
        tone === 'accent' ? 'text-accent' : 'text-subtle',
        className
      )}
    >
      {children}
    </span>
  );
}
