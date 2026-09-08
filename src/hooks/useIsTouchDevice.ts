'use client';

import { useEffect, useState } from 'react';

/**
 * True on devices without fine pointer + hover support (touch/tablets),
 * used to disable the custom cursor and pointer-only interactions.
 */
export function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(true);

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)');
    setIsTouch(!query.matches);

    const handler = (e: MediaQueryListEvent) => setIsTouch(!e.matches);
    query.addEventListener('change', handler);
    return () => query.removeEventListener('change', handler);
  }, []);

  return isTouch;
}
