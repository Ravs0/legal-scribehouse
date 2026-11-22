/** Marks sections that are well off-screen with [data-offscreen] so their looping animations pause (see perf.css). */
export function watchOffscreen() {
  if (typeof IntersectionObserver === 'undefined') return;
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => (e.target as HTMLElement).toggleAttribute('data-offscreen', !e.isIntersecting)),
    { rootMargin: '200px 0px' },
  );
  const scan = () => document.querySelectorAll('main section[id]').forEach((s) => io.observe(s));
  scan();
  new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
}
