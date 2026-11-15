import { MouseEvent } from 'react';

const MAX_TILT = 6; // degrees

const canTilt = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (min-width: 1024px)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Sets --mx/--my (sheen) and --rx/--ry (tilt) on a `.lift-card`. */
export function pointerGlow(e: MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = e.clientX - r.left;
  const y = e.clientY - r.top;
  el.style.setProperty('--mx', `${x}px`);
  el.style.setProperty('--my', `${y}px`);
  if (!canTilt()) return;
  const px = x / r.width - 0.5;
  const py = y / r.height - 0.5;
  el.style.setProperty('--ry', `${(px * 2 * MAX_TILT).toFixed(2)}deg`);
  el.style.setProperty('--rx', `${(-py * 2 * MAX_TILT).toFixed(2)}deg`);
  el.dataset.tilting = 'true';
}

export function pointerReset(e: MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  el.style.setProperty('--rx', '0deg');
  el.style.setProperty('--ry', '0deg');
  el.dataset.tilting = 'false';
}

/** Spread onto any `.lift-card`. */
export const tilt = { onMouseMove: pointerGlow, onMouseLeave: pointerReset };
