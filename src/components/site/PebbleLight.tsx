import { useEffect } from 'react';

/** Surfaces that carry the pebble finish; their highlight glides toward the pointer. */
const SELECTOR = '.surface-1, .surface-2, .surface-3, .surface-4, .btn-filled, .btn-device, .btn-raised, .bezel, .pebble';

/**
 * One delegated pointer listener for the whole page: the pebble under the cursor gets --lx/--ly
 * (registered properties, so the sheen glides); when the pointer leaves, it drifts back to rest.
 */
export const PebbleLight = () => {
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || reduced.matches) return;

    let current: HTMLElement | null = null;
    let raf = 0;
    let x = 0;
    let y = 0;
    let target: EventTarget | null = null;

    const release = (el: HTMLElement | null) => {
      if (!el) return;
      el.style.removeProperty('--lx');
      el.style.removeProperty('--ly');
    };

    const paint = () => {
      raf = 0;
      const el = target instanceof Element ? (target.closest(SELECTOR) as HTMLElement | null) : null;
      if (el !== current) {
        release(current);
        current = el;
      }
      if (!el) return;
      const r = el.getBoundingClientRect();
      // Keep the highlight in the upper half so the light still reads as coming from above.
      const lx = Math.max(-10, Math.min(110, ((x - r.left) / r.width) * 100));
      const ly = Math.max(-20, Math.min(55, ((y - r.top) / r.height) * 100 * 0.6 - 10));
      el.style.setProperty('--lx', `${lx.toFixed(1)}%`);
      el.style.setProperty('--ly', `${ly.toFixed(1)}%`);
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      target = e.target;
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const onLeave = () => {
      release(current);
      current = null;
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      document.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
      release(current);
    };
  }, []);
  return null;
};
