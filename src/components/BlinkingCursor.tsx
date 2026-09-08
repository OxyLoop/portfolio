import { cn } from '@/lib/utils';

interface BlinkingCursorProps {
  className?: string;
}

/** A small terminal-style blinking block caret. Pure CSS animation — no JS, no library cost. */
export default function BlinkingCursor({ className }: BlinkingCursorProps) {
  return (
    <span
      aria-hidden="true"
      className={cn('animate-caret inline-block h-[1em] w-[0.55em] translate-y-[0.1em] bg-accent align-middle', className)}
    />
  );
}
