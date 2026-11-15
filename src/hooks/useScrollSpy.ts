import { useEffect, useState } from 'react';

/** Returns the id of the section currently under the header, or null. */
export function useScrollSpy(ids: string[], enabled = true) {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join(',');

  useEffect(() => {
    if (!enabled) {
      setActive(null);
      return;
    }
    const els = key
      .split(',')
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!els.length || typeof IntersectionObserver === 'undefined') return;

    const visible = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(e.target.id, e.isIntersecting);
        const first = els.find((el) => visible.get(el.id));
        setActive(first ? first.id : null);
      },
      // A thin band just under the floating header.
      { rootMargin: '-120px 0px -60% 0px', threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [key, enabled]);

  return active;
}
