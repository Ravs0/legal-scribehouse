import { CONTOUR_PATHS } from '@/lib/contours';
import { cn } from '@/lib/utils';

/** Topographic contour texture. Decorative; keep it out from behind body text. */
export const Contours = ({ className, opacity = 1 }: { className?: string; opacity?: number }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 800 600"
    preserveAspectRatio="xMidYMid slice"
    className={cn('pointer-events-none', className)}
    style={{ opacity }}
    fill="none"
  >
    {CONTOUR_PATHS.map((p, i) => (
      <path key={i} d={p.d} stroke="var(--contour)" strokeWidth={p.major ? 1.5 : 1} style={p.major ? { opacity: 1 } : undefined} />
    ))}
  </svg>
);
