import { useEffect, useState } from 'react';
import { useBlogStore } from '@/stores/blogStore';

/** Ensures blog content is loaded; returns published items and a ready flag. */
export function useInsights() {
  const { content, authors, fetchContent, fetchAuthors } = useBlogStore();
  const [ready, setReady] = useState(content.length > 0);

  useEffect(() => {
    let alive = true;
    Promise.all([fetchContent(), fetchAuthors()]).finally(() => alive && setReady(true));
    return () => {
      alive = false;
    };
  }, [fetchContent, fetchAuthors]);

  return { items: content.filter((c) => !c.draft), authors, ready };
}
