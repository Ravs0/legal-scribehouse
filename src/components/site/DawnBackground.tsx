/** Static warm-light backdrop: base gradient, three soft blobs and a whisper of grain. No animation. */
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const BLOBS = [
  { v: '--blob-1', size: 60, x: 86, y: 4 },
  { v: '--blob-2', size: 48, x: 8, y: 22 },
  { v: '--blob-3', size: 44, x: 70, y: 96 },
];

export const DawnBackground = () => (
  <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" style={{ background: 'var(--bg-base)' }}>
    {BLOBS.map((b) => (
      <div
        key={b.v}
        className="absolute rounded-full"
        style={{
          width: `${b.size}vmax`,
          height: `${b.size}vmax`,
          left: `calc(${b.x}% - ${b.size / 2}vmax)`,
          top: `calc(${b.y}% - ${b.size / 2}vmax)`,
          background: `radial-gradient(closest-side, var(${b.v}), transparent)`,
        }}
      />
    ))}
    <div
      className="absolute inset-0"
      style={{ backgroundImage: GRAIN, opacity: 'var(--grain-opacity)' as unknown as number, mixBlendMode: 'var(--grain-blend)' as never }}
    />
  </div>
);
