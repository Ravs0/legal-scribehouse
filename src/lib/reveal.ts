/**
 * One-shot "has this element been seen?" registry shared by Reveal, CountUp and useInView.
 *
 * v3.7: three layers so nothing can stay hidden:
 *  1. one IntersectionObserver for every element (fires when 15% of the element, or 15% of the viewport for tall
 *     elements, is visible). No rootMargin: cross-origin iframes (the artifact preview) ignore it anyway.
 *  2. a passive, rAF-throttled scroll/resize check using getBoundingClientRect, for hosts where the observer is
 *     late or silent (some embedded iframes never deliver updates after the first callback).
 *  3. a per-element timeout: if the observer has not delivered even its initial callback within 1.5s it is
 *     treated as broken and the element is revealed.
 * Elements that are already above the viewport (jumped past via an anchor) count as seen.
 */
type Entry = { cb: (order: number) => void; ratio: number; heard: boolean; timer: number };

const pending = new Map<Element, Entry>();
let io: IntersectionObserver | null = null;
let raf = 0;
let listening = false;

// Inside an iframe (the artifact preview) the frame may be sized to its content, so its own innerHeight says nothing
// about what the visitor can see. There the observer (which clips to the top-level viewport) decides, and the
// rect check only runs on real scroll events inside the frame.
const inFrame = (() => {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
})();

const viewportH = () => window.innerHeight || document.documentElement.clientHeight;

function seen(el: Element, ratio: number, rect: DOMRect = el.getBoundingClientRect()) {
  if (rect.width === 0 && rect.height === 0) return false; // display:none or not laid out yet
  const vh = viewportH();
  if (rect.bottom <= 0) return true; // already scrolled past
  const visible = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
  return visible > 0 && visible >= Math.min(rect.height, vh) * ratio - 0.5;
}

/** `order` is the element's position among those revealed in the same frame, so a row of cards that comes into
 * view together staggers 0, 1, 2… while a card that scrolls in on its own starts at once. */
function done(el: Element, order = 0) {
  const e = pending.get(el);
  if (!e) return;
  pending.delete(el);
  window.clearTimeout(e.timer);
  io?.unobserve(el);
  e.cb(order);
  if (pending.size === 0) stopListening();
}

function sweep() {
  raf = 0;
  let n = 0;
  for (const [el, e] of [...pending]) if (seen(el, e.ratio)) done(el, n++);
}
const onScroll = () => {
  if (!raf) raf = requestAnimationFrame(sweep);
};
const onResize = () => {
  if (!inFrame) onScroll();
};
function startListening() {
  if (listening) return;
  listening = true;
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
}
function stopListening() {
  if (!listening) return;
  listening = false;
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', onResize);
}

function getObserver() {
  if (io || typeof IntersectionObserver === 'undefined') return io;
  io = new IntersectionObserver(
    (entries) => {
      let n = 0;
      const sortedEntries = [...entries].sort((a, b) =>
        a.target.compareDocumentPosition(b.target) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
      );
      for (const en of sortedEntries) {
        const e = pending.get(en.target);
        if (!e) continue;
        e.heard = true;
        if (en.isIntersecting && seen(en.target, e.ratio, en.boundingClientRect)) done(en.target, n++);
        else if (!en.isIntersecting && en.boundingClientRect.bottom <= 0) done(en.target, n++);
      }
    },
    { threshold: [0, 0.05, 0.1, 0.15, 0.25, 0.5, 0.75, 1] },
  );
  return io;
}

/** Calls `cb` once, the first time `ratio` of the element (or of the viewport, for tall elements) is on screen. */
export function observeOnce(el: Element, cb: (order: number) => void, ratio = 0.15): () => void {
  const obs = getObserver();
  const entry: Entry = { cb, ratio, heard: !obs, timer: 0 };
  pending.set(el, entry);
  entry.timer = window.setTimeout(() => {
    // Observer never answered: assume it is broken in this host and show the element.
    if (!entry.heard) done(el);
  }, 1500);
  obs?.observe(el);
  startListening();
  onResize(); // initial rect check on the next frame (top-level window only)
  return () => {
    const e = pending.get(el);
    if (!e) return;
    pending.delete(el);
    window.clearTimeout(e.timer);
    io?.unobserve(el);
    if (pending.size === 0) stopListening();
  };
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
