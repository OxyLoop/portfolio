type Listener = () => void;

let suppressed = false;
const listeners = new Set<Listener>();

/**
 * Hides (true) or restores (false) the site's global custom cursor dot.
 * Used by interactive CustomScrollbar instances so the native
 * pointer/grab/grabbing cursor can show through while hovering or dragging
 * a scrollbar, instead of the custom dot rendering on top of it.
 *
 * A plain module-level store (rather than React context) so any component —
 * not just descendants of a provider — can call it, and CustomCursor stays
 * the only component that renders the dot.
 */
export function setCursorSuppressed(value: boolean) {
  if (suppressed === value) return;
  suppressed = value;
  listeners.forEach((listener) => listener());
}

export function getCursorSuppressed() {
  return suppressed;
}

export function subscribeCursorSuppressed(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
