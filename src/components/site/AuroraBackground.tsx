import { useLocation } from 'react-router-dom';
import { useHeroVisible } from '@/stores/heroVisible';

const BLOBS = [
  { n: 1, size: 70, x: 12, y: 8, anim: 'animate-aurora-1' },
  { n: 2, size: 55, x: 82, y: 30, anim: 'animate-aurora-2' },
  { n: 3, size: 50, x: 68, y: 88, anim: 'animate-aurora-3' },
  { n: 4, size: 30, x: 30, y: 78, anim: 'animate-aurora-4' },
];

/**
 * Fixed aurora behind the whole site: four drifting radial-gradient blobs (transform-only animation,
 * no filter blur) plus a veil that lifts while the home hero is on screen.
 */
export const AuroraBackground = () => {
  const { pathname } = useLocation();
  const heroVisible = useHeroVisible((s) => s.visible);
  const unveiled = pathname === '/' && heroVisible;

  return (
    <div aria-hidden="true" className="aurora-layer pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      {BLOBS.map((b) => (
        <div
          key={b.n}
          className={`absolute rounded-full will-change-transform ${b.anim}`}
          style={{
            width: `${b.size}vmax`,
            height: `${b.size}vmax`,
            left: `calc(${b.x}% - ${b.size / 2}vmax)`,
            top: `calc(${b.y}% - ${b.size / 2}vmax)`,
            background: `radial-gradient(closest-side, hsl(var(--aurora-${b.n}) / calc(var(--aurora-a${b.n}) * var(--aurora-dim, 1))), transparent)`,
          }}
        />
      ))}
      <div
        className="absolute inset-0 transition-[background-color] duration-long4 ease-standard"
        style={{ backgroundColor: `hsl(var(--background) / ${unveiled ? 0 : 'var(--veil-max)'})` }}
      />
    </div>
  );
};
