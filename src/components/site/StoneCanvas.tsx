import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from 'next-themes';
import type { StoneScene } from '@/three/StoneScene';

const hasWebGL = () => {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
};

/**
 * Fixed full-viewport WebGL layer of floating stones, between the aurora and the glass UI.
 * three.js is loaded lazily after first paint; without WebGL the canvas never mounts.
 */
export const StoneCanvas = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<StoneScene | null>(null);
  const [enabled] = useState(() => typeof window !== 'undefined' && hasWebGL());
  const [ready, setReady] = useState(false);
  const { pathname } = useLocation();
  const { resolvedTheme } = useTheme();
  const themeRef = useRef(resolvedTheme);
  themeRef.current = resolvedTheme;

  useEffect(() => {
    if (!enabled || !ref.current) return;
    let cancelled = false;
    const canvas = ref.current;
    const mobile = window.matchMedia('(max-width: 767px)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cleanups: (() => void)[] = [];

    const boot = async () => {
      const { StoneScene } = await import('@/three/StoneScene');
      if (cancelled) return;
      const scene = new StoneScene({
        canvas,
        mobile,
        reducedMotion,
        theme: themeRef.current === 'light' ? 'light' : 'dark',
      });
      sceneRef.current = scene;
      scene.start();
      setReady(true);

      const onResize = () => scene.resize();
      window.addEventListener('resize', onResize);
      cleanups.push(() => window.removeEventListener('resize', onResize));

      if (!reducedMotion && window.matchMedia('(hover: hover)').matches) {
        const onMove = (e: PointerEvent) =>
          scene.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
        window.addEventListener('pointermove', onMove, { passive: true });
        cleanups.push(() => window.removeEventListener('pointermove', onMove));
      }
      if (reducedMotion) {
        // No animation: just re-place the stones when scrolling settles.
        let t = 0;
        const onScroll = () => {
          window.clearTimeout(t);
          t = window.setTimeout(() => scene.renderStatic(), 150);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        cleanups.push(() => window.removeEventListener('scroll', onScroll));
      }
    };

    // Never compete with first paint.
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    const id = w.requestIdleCallback ? w.requestIdleCallback(boot, { timeout: 1200 }) : window.setTimeout(boot, 300);

    return () => {
      cancelled = true;
      const wc = window as Window & { cancelIdleCallback?: (id: number) => void };
      if (wc.cancelIdleCallback) wc.cancelIdleCallback(id);
      else window.clearTimeout(id);
      cleanups.forEach((fn) => fn());
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, [enabled]);

  useEffect(() => {
    sceneRef.current?.setTheme(resolvedTheme === 'light' ? 'light' : 'dark');
  }, [resolvedTheme]);

  // New route: wait for the page to mount, then pick up its [data-stage] sections.
  useEffect(() => {
    const id = window.setTimeout(() => {
      sceneRef.current?.refreshStages();
      sceneRef.current?.renderStatic?.();
    }, 60);
    return () => window.clearTimeout(id);
  }, [pathname, ready]);

  if (!enabled) return null;
  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="stone-layer pointer-events-none fixed inset-0 -z-[5] h-full w-full opacity-0 transition-opacity duration-long4 ease-standard data-[ready=true]:opacity-100 max-md:data-[ready=true]:opacity-70"
      data-ready={ready}
    />
  );
};
