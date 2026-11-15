import { PointerEvent as ReactPointerEvent, useCallback } from 'react';

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Material ripple. Returns a pointerdown handler that spawns a wave from the pointer.
 * The host element needs `position: relative; overflow: hidden` (the `.state-layer` + `overflow-hidden` classes).
 */
export function useRipple<T extends HTMLElement = HTMLElement>(onPointerDown?: (e: ReactPointerEvent<T>) => void) {
  return useCallback(
    (e: ReactPointerEvent<T>) => {
      onPointerDown?.(e);
      if (e.button !== 0 || reducedMotion()) return;
      spawnRipple(e.currentTarget, e.clientX, e.clientY);
    },
    [onPointerDown],
  );
}

export function spawnRipple(host: HTMLElement, clientX: number, clientY: number) {
  if (reducedMotion()) return;
  const rect = host.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  const radius = Math.max(
    Math.hypot(x, y),
    Math.hypot(rect.width - x, y),
    Math.hypot(x, rect.height - y),
    Math.hypot(rect.width - x, rect.height - y),
  );
  const wave = document.createElement('span');
  wave.className = 'ripple-wave';
  wave.setAttribute('aria-hidden', 'true');
  wave.style.width = wave.style.height = `${radius * 2}px`;
  wave.style.left = `${x - radius}px`;
  wave.style.top = `${y - radius}px`;
  host.appendChild(wave);

  const fade = () => {
    wave.style.opacity = '0';
    window.setTimeout(() => wave.remove(), 220);
    window.removeEventListener('pointerup', fade);
    window.removeEventListener('pointercancel', fade);
  };
  // Fade only after the expansion has had time to read, and after release.
  const minLife = window.setTimeout(() => {
    window.addEventListener('pointerup', fade, { once: true });
    window.addEventListener('pointercancel', fade, { once: true });
  }, 0);
  wave.addEventListener('animationend', () => {
    window.clearTimeout(minLife);
    // If the pointer is already up, fade now.
    if (!(host.matches(':active'))) fade();
  });
}
