import { MouseEvent } from 'react';

/** Sets --mx / --my on the card so the `.lift-card` glow follows the cursor. */
export function pointerGlow(e: MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - r.left}px`);
  el.style.setProperty('--my', `${e.clientY - r.top}px`);
}
