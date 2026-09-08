'use client';

import { useEffect, useState } from 'react';

/**
 * Rotates a single "active" slot among `count` candidates at a random,
 * non-repeating interval — used to keep a grid of GIF previews from all
 * animating at once (one plays at a time, then a different random one takes
 * over). Returns null when nothing should be active (no candidates, or
 * `enabled` is false — e.g. the viewer prefers reduced motion).
 */
export function useRandomSequentialActivation(count: number, intervalMs: number, enabled: boolean) {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (!enabled || count === 0) {
      setActive(null);
      return;
    }

    let previous = -1;
    const pickNext = () => {
      if (count === 1) return 0;
      let next = Math.floor(Math.random() * count);
      if (next === previous) next = (next + 1) % count;
      previous = next;
      return next;
    };

    setActive(pickNext());
    const id = setInterval(() => setActive(pickNext()), intervalMs);
    return () => clearInterval(id);
  }, [count, intervalMs, enabled]);

  return active;
}
