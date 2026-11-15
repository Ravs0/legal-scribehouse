import { useEffect, useMemo, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/lib/utils';

/**
 * Schematic ASCII route chart (not a geographic map).
 *
 * Four stacked <pre> layers share one character grid:
 *   sea (animated swell) < route (dotted lanes) < labels (UN/LOCODEs) < accent (port nodes + ship)
 * The sea is blanked wherever a higher layer draws, so glyphs never overlap.
 * Animation runs at 12fps (the low frame rate is part of the look), pauses off-screen
 * and in background tabs, and collapses to a single static frame for reduced motion.
 */

type Point = [number, number];
interface Port {
  code: string;
  x: number; // column of the "(" in "(o)"
  y: number;
}
interface Layout {
  cols: number;
  rows: number;
  entry: Point;
  hub: string;
  ports: Port[];
}

const DESKTOP: Layout = {
  cols: 64,
  rows: 22,
  entry: [0, 11],
  hub: 'SGSIN',
  ports: [
    { code: 'THBKK', x: 22, y: 5 },
    { code: 'VNSGN', x: 34, y: 8 },
    { code: 'PHMNL', x: 52, y: 5 },
    { code: 'MYPKG', x: 20, y: 13 },
    { code: 'SGSIN', x: 26, y: 16 },
    { code: 'IDJKT', x: 32, y: 20 },
  ],
};

const MOBILE: Layout = {
  cols: 36,
  rows: 16,
  entry: [0, 7],
  hub: 'SGSIN',
  ports: [
    { code: 'VNSGN', x: 19, y: 5 },
    { code: 'PHMNL', x: 28, y: 2 },
    { code: 'SGSIN', x: 12, y: 10 },
    { code: 'IDJKT', x: 19, y: 14 },
  ],
};

const STATUS_LINES = [
  '> HS 3304.99 classified ... OK',
  '> Form D origin check ... OK',
  '> Distributor agreement: governing law SG, SIAC ... OK',
  '> Trademark filed: Class 3, ID/MY/VN ... OK',
  '> Registration holder agreed in writing ... OK',
  '> Incoterms 2020: FCA, named place set ... OK',
];

const FPS = 12;
const LEG_MS = 9000;
const PAUSE_MS = 1500;
const ROUTE_DRAW_MS = 1600;
const TYPE_MS = 28;
const SHIP_TOP = ' _|_ ';
const SHIP_HULL = '\\___/';

/** Bresenham line, inclusive of both ends. */
function line([x0, y0]: Point, [x1, y1]: Point): Point[] {
  const pts: Point[] = [];
  const dx = Math.abs(x1 - x0);
  const dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  let x = x0;
  let y = y0;
  for (;;) {
    pts.push([x, y]);
    if (x === x1 && y === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      x += sx;
    }
    if (e2 <= dx) {
      err += dx;
      y += sy;
    }
  }
  return pts;
}

const center = (p: Port): Point => [p.x + 1, p.y];

type Grid = string[][];
const blank = (l: Layout): Grid => Array.from({ length: l.rows }, () => Array(l.cols).fill(' '));
const put = (g: Grid, x: number, y: number, ch: string) => {
  if (y >= 0 && y < g.length && x >= 0 && x < g[0].length) g[y][x] = ch;
};
const write = (g: Grid, x: number, y: number, s: string) => {
  for (let i = 0; i < s.length; i++) if (s[i] !== ' ') put(g, x + i, y, s[i]);
};
const toText = (g: Grid) => g.map((r) => r.join('')).join('\n');

function buildStatic(l: Layout) {
  const hub = l.ports.find((p) => p.code === l.hub)!;
  const others = l.ports.filter((p) => p !== hub);

  // Labels: to the right of the node if they fit, otherwise to the left.
  const labels = blank(l);
  for (const p of l.ports) {
    const right = p.x + 4;
    if (right + p.code.length <= l.cols) write(labels, right, p.y, p.code);
    else write(labels, p.x - 1 - p.code.length, p.y, p.code);
  }

  // Route cells in drawing order: entry -> hub, then each branch.
  const reserved = new Set<string>();
  for (const p of l.ports) for (let i = 0; i < 3; i++) reserved.add(`${p.x + i},${p.y}`);
  const routeCells: Point[] = [];
  const seen = new Set<string>();
  const addSegment = (pts: Point[]) => {
    for (const [x, y] of pts) {
      const k = `${x},${y}`;
      if (reserved.has(k) || seen.has(k) || labels[y]?.[x] !== ' ') continue;
      seen.add(k);
      routeCells.push([x, y]);
    }
  };
  addSegment(line(l.entry, center(hub)));
  for (const p of others) addSegment(line(center(hub), center(p)));

  return { hub, others, labels, routeCells };
}

interface ShipState {
  path: Point[];
  progress: number; // 0..1 along path
  dockedAt: string | null; // port code while paused
}

function renderFrame(
  l: Layout,
  st: ReturnType<typeof buildStatic>,
  t: number,
  routeFraction: number,
  ship: ShipState,
) {
  const route = blank(l);
  const shown = Math.floor(st.routeCells.length * routeFraction);
  for (let i = 0; i < shown; i++) {
    const [x, y] = st.routeCells[i];
    put(route, x, y, '.');
  }

  const accent = blank(l);
  for (const p of l.ports) write(accent, p.x, p.y, ship.dockedAt === p.code ? '(*)' : '(o)');

  if (ship.path.length) {
    const idx = Math.min(ship.path.length - 1, Math.floor(ship.progress * (ship.path.length - 1)));
    const [sx, sy] = ship.path[idx];
    // Wake: soften a few route cells behind the ship.
    for (let k = 3; k <= 5; k++) {
      const w = ship.path[idx - k];
      if (w) put(route, w[0], w[1], k === 3 ? '=' : '-');
    }
    // The ship rides one row above its lane, so it never covers a port node or label.
    write(accent, sx - 2, sy - 2, SHIP_TOP);
    write(accent, sx - 2, sy - 1, SHIP_HULL);
  }

  // Sea swell, blanked under every other layer.
  const sea = blank(l);
  for (let y = 0; y < l.rows; y++) {
    for (let x = 0; x < l.cols; x++) {
      if (route[y][x] !== ' ' || accent[y][x] !== ' ' || st.labels[y][x] !== ' ') continue;
      // Keep a little clear water around labels and nodes for legibility.
      if (st.labels[y][x - 1] && st.labels[y][x - 1] !== ' ') continue;
      const v = Math.sin(x * 0.35 + t) + Math.sin(y * 0.6 - t * 0.7 + x * 0.1);
      sea[y][x] = v > 1.45 ? '~' : v > 0.95 ? '-' : ' ';
    }
  }

  return { sea: toText(sea), route: toText(route), labels: toText(st.labels), accent: toText(accent) };
}

function useIsSmall() {
  const query = '(max-width: 639px)';
  const [small, setSmall] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query).matches : false,
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setSmall(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);
  return small;
}

export const AsciiSeaChart = ({ className }: { className?: string }) => {
  const small = useIsSmall();
  const reduced = usePrefersReducedMotion();
  const layout = small ? MOBILE : DESKTOP;
  const st = useMemo(() => buildStatic(layout), [layout]);

  // First paint: a complete static frame with the ship docked at the hub, so there is no layout shift.
  const initial = useMemo(() => {
    const hubCenter = center(st.hub);
    return renderFrame(layout, st, 0, 1, { path: [hubCenter], progress: 0, dockedAt: st.hub.code });
  }, [layout, st]);

  const wrapRef = useRef<HTMLDivElement>(null);
  const seaRef = useRef<HTMLPreElement>(null);
  const routeRef = useRef<HTMLPreElement>(null);
  const accentRef = useRef<HTMLPreElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduced) return;
    const wrap = wrapRef.current;
    if (!wrap) return;

    let raf = 0;
    let visible = true;
    let started = false;
    let last = 0;
    let clock = 0; // ms of animation time (only advances while visible)
    let prevNow = 0;

    // Ship timeline
    let legPath: Point[] = line(layout.entry, center(st.hub));
    let legStart = ROUTE_DRAW_MS;
    let pauseUntil = -1;
    let dockedAt: string | null = null;
    let goingToHub = true;
    let statusIndex = 0;
    let statusStart = -1;
    let statusText = '';

    const nextLeg = () => {
      if (goingToHub) {
        const dest = st.others[Math.floor(Math.random() * st.others.length)];
        legPath = line(center(st.hub), center(dest));
      } else {
        legPath = line(layout.entry, center(st.hub));
      }
      goingToHub = !goingToHub;
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) {
        prevNow = now;
        return;
      }
      clock += prevNow ? Math.min(now - prevNow, 100) : 0;
      prevNow = now;

      // Status line types every rAF tick so it reads smoothly.
      if (statusStart >= 0 && statusRef.current) {
        const n = Math.min(statusText.length, Math.floor((clock - statusStart) / TYPE_MS));
        const shown = statusText.slice(0, n);
        if (statusRef.current.textContent !== shown) statusRef.current.textContent = shown;
      }

      if (now - last < 1000 / FPS) return;
      last = now;

      // Advance the ship.
      let progress = 0;
      if (pauseUntil >= 0) {
        if (clock >= pauseUntil) {
          pauseUntil = -1;
          dockedAt = null;
          nextLeg();
          legStart = clock;
        } else {
          progress = 1;
        }
      } else if (clock >= legStart) {
        progress = Math.min(1, (clock - legStart) / LEG_MS);
        if (progress >= 1) {
          const [ex, ey] = legPath[legPath.length - 1];
          const port = layout.ports.find((p) => center(p)[0] === ex && center(p)[1] === ey);
          dockedAt = port?.code ?? null;
          pauseUntil = clock + PAUSE_MS;
          statusText = STATUS_LINES[statusIndex++ % STATUS_LINES.length];
          statusStart = clock;
        }
      }

      const routeFraction = Math.min(1, clock / ROUTE_DRAW_MS);
      const ship: ShipState =
        clock < legStart && pauseUntil < 0
          ? { path: [], progress: 0, dockedAt: null }
          : { path: legPath, progress, dockedAt };
      const f = renderFrame(layout, st, clock / 1100, routeFraction, ship);
      if (seaRef.current) seaRef.current.textContent = f.sea;
      if (routeRef.current) routeRef.current.textContent = f.route;
      if (accentRef.current) accentRef.current.textContent = f.accent;
    };

    const start = () => {
      if (started) return;
      started = true;
      raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting && !document.hidden;
    });
    io.observe(wrap);
    const onVis = () => {
      visible = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVis);

    // Never compete with first paint.
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    const idleId = ric ? ric(start) : window.setTimeout(start, 200);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      const cic = (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;
      if (ric && cic) cic(idleId);
      else window.clearTimeout(idleId);
    };
  }, [layout, st, reduced]);

  const fontSize = small ? 'clamp(9px, 3.6vw, 14px)' : 'clamp(9px, 1.35vw, 14px)';
  const pre = 'm-0 whitespace-pre font-mono leading-[1.15]';

  return (
    <div
      aria-hidden="true"
      className={cn('select-none border border-border bg-card/70 backdrop-blur-[1px]', className)}
    >
      <div className="label-mono flex items-center justify-between border-b border-border px-3 py-2 text-muted-foreground">
        <span>Fig. 1 — Routes in</span>
        <span>Not to scale</span>
      </div>
      <div className="flex justify-center overflow-hidden px-3 py-4">
        <div ref={wrapRef} className="relative max-w-full" style={{ fontSize }}>
          <pre ref={seaRef} className={cn(pre, 'text-ascii opacity-70')}>
            {initial.sea}
          </pre>
          <pre ref={routeRef} className={cn(pre, 'absolute inset-0 font-medium text-primary')}>
            {initial.route}
          </pre>
          <pre className={cn(pre, 'absolute inset-0 text-foreground')}>{initial.labels}</pre>
          <pre ref={accentRef} className={cn(pre, 'absolute inset-0 font-medium text-accent')}>
            {initial.accent}
          </pre>
        </div>
      </div>
      <div className="min-h-[3.4em] border-t border-border px-3 py-2 font-mono text-[11px] text-muted-foreground sm:min-h-0 sm:text-xs">
        <span ref={statusRef}>{STATUS_LINES[0]}</span>
        <span className="blink ml-0.5 text-accent">_</span>
      </div>
    </div>
  );
};
