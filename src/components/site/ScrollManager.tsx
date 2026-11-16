import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE_TITLE } from '@/config/site';

/** Scrolls to #hash targets after navigation (waiting for the section to mount) or to the top on route change. */
export const ScrollManager = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    document.title = SITE_TITLE;
  }, []);

  useEffect(() => {
    if (!hash) {
      // Instant: the page container's 200ms fade covers the jump; a smooth scroll here would fight it.
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      return;
    }
    const id = decodeURIComponent(hash.slice(1));
    let tries = 0;
    let raf = 0;
    const attempt = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ block: 'start' });
      } else if (tries++ < 30) {
        raf = requestAnimationFrame(attempt);
      }
    };
    attempt();
    return () => cancelAnimationFrame(raf);
  }, [pathname, hash]);

  return null;
};
