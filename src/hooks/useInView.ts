import { RefObject, useEffect, useState } from 'react';
import { observeOnce } from '@/lib/reveal';

interface Options {
  /** Share of the element (or of the viewport, for elements taller than it) that must be visible. Default 15%. */
  threshold?: number;
}

/**
 * True once the element has been on screen. Uses the shared reveal registry (IntersectionObserver plus a scroll
 * check plus a timeout), so it also fires inside embedded iframes and never leaves content hidden.
 */
export function useInView<T extends Element>(ref: RefObject<T>, { threshold = 0.15 }: Options = {}) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    return observeOnce(el, () => setInView(true), threshold);
  }, [ref, threshold, inView]);

  return inView;
}
