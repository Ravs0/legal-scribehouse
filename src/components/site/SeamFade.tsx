import type { CSSProperties } from 'react';

/**
 * v6.1 seam: no added band. A zero-height marker between two sections that lays an eased fade over the real
 * background of one of them:
 *   onto="next": `color` (the bottom colour of the section above) fades out down the top of the next section;
 *   onto="prev": `color` (the top colour of the section below) fades in up the bottom of the previous section.
 * The alpha follows an easing curve (no visible start or end line) and mixes in OKLab (no muddy grey midtones).
 */
const EASE: [number, number][] = [
  [1, 0], [0.987, 8.1], [0.951, 15.5], [0.896, 22.5], [0.825, 29], [0.741, 35.3], [0.648, 41.2], [0.55, 47.1],
  [0.45, 52.9], [0.352, 58.8], [0.259, 64.7], [0.175, 71], [0.104, 77.5], [0.049, 84.5], [0.013, 91.9], [0, 100],
];

const eased = (color: string, dir: 'down' | 'up') =>
  `linear-gradient(${dir === 'down' ? '180deg' : '0deg'}, ${EASE.map(
    ([a, p]) => `color-mix(in oklab, ${color} ${Math.round(a * 1000) / 10}%, transparent) ${p}%`,
  ).join(', ')})`;

export const SeamFade = ({ color, onto = 'next', height = 160 }: { color: string; onto?: 'next' | 'prev'; height?: number }) => {
  const style: CSSProperties = {
    height,
    background: eased(color, onto === 'next' ? 'down' : 'up'),
    ...(onto === 'next' ? { top: 0 } : { bottom: 0 }),
  };
  return (
    <div aria-hidden="true" className="seam-fade pointer-events-none relative z-[6] h-0">
      <div className="absolute inset-x-0" style={style} />
    </div>
  );
};
