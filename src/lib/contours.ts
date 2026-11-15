/** Deterministic topographic contours: nested jittered rings around three "hills". */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function closedPath(pts: [number, number][]) {
  // Catmull-Rom → cubic Bézier, closed.
  const n = pts.length;
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d + 'Z';
}

const HILLS: { cx: number; cy: number; rings: number; r0: number; seed: number }[] = [
  { cx: 210, cy: 190, rings: 5, r0: 26, seed: 3 },
  { cx: 560, cy: 300, rings: 5, r0: 34, seed: 7 },
  { cx: 330, cy: 470, rings: 4, r0: 22, seed: 11 },
];

export const CONTOUR_PATHS: { d: string; major: boolean }[] = (() => {
  const out: { d: string; major: boolean }[] = [];
  let count = 0;
  for (const h of HILLS) {
    const rand = rng(h.seed);
    const base = Array.from({ length: 8 }, () => rand() * 20 - 10);
    for (let k = 0; k < h.rings; k++) {
      const r = h.r0 + k * 18 + k * k * 3;
      const pts: [number, number][] = [];
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        const jitter = base[i] * (1 + k * 0.35) + (rand() * 20 - 10) * 0.5;
        pts.push([h.cx + Math.cos(a) * (r + jitter) * 1.25, h.cy + Math.sin(a) * (r + jitter)]);
      }
      count++;
      out.push({ d: closedPath(pts), major: count % 5 === 0 });
    }
  }
  return out;
})();
