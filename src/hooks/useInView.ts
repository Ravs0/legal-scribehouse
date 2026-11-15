import { RefObject, useEffect, useState } from 'react';

interface Options {
  once?: boolean;
  threshold?: number;
  rootMargin?: string;
}

/** True once (or while) the element is on screen. Falls back to "visible" without IntersectionObserver. */
export function useInView<T extends Element>(
  ref: RefObject<T>,
  { once = true, threshold = 0.2, rootMargin = '0px 0px -40px 0px' }: Options = {},
) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, once, threshold, rootMargin]);

  return inView;
}
