import { useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { prefersReducedMotion } from '@/lib/reveal';

const SUN = [
  '00000100000',
  '01000100010',
  '00100000100',
  '00001110000',
  '00011111000',
  '11011111011',
  '00011111000',
  '00001110000',
  '00100000100',
  '01000100010',
  '00000100000',
];
const MOON = [
  '00011110000',
  '00111000000',
  '01110000000',
  '01100000000',
  '11100000000',
  '11100000000',
  '11100000000',
  '01110000010',
  '01111001110',
  '00111111100',
  '00011111000',
];

const N = 11;
const on = (map: string[], i: number) => map[Math.floor(i / N)][i % N] === '1';

/**
 * Theme switch: a dark recessed slot with a glowing key (orange in light, cyan in dark).
 * The key carries an 11×11 pixel icon that dissolves between sun and moon.
 */
export const ThemeKey = ({ className }: { className?: string }) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = mounted && resolvedTheme === 'dark';

  // Per-cell random jitter, fixed for the session so the dissolve has texture but is stable.
  const jitter = useMemo(() => Array.from({ length: N * N }, () => Math.random() * 60), []);
  const prev = useRef(dark);
  const switching = prev.current !== dark;
  useEffect(() => {
    prev.current = dark;
  }, [dark]);

  // v3.7: the page cross-fades between themes in 200ms (View Transitions: opacity only, no layout animation).
  // The class is applied inside the transition callback so the "new" snapshot is the new theme.
  const toggle = () => {
    const next = dark ? 'light' : 'dark';
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
    if (!doc.startViewTransition || prefersReducedMotion()) return setTheme(next);
    doc.startViewTransition(() => {
      const root = document.documentElement;
      root.classList.toggle('dark', next === 'dark');
      root.classList.toggle('light', next === 'light');
      root.style.colorScheme = next;
      flushSync(() => setTheme(next));
    });
  };

  const map = dark ? MOON : SUN;
  const before = switching ? (dark ? SUN : MOON) : map;
  const color = dark ? '#BDEFFF' : '#FFD9A0';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Dark theme"
      onClick={toggle}
      className={cn('hit group relative h-10 w-[72px] shrink-0 rounded-[14px]', className)}
      style={{
        background: dark ? '#07060A' : '#0E0C0B',
        boxShadow: dark
          ? 'inset 0 2px 5px #000, inset 0 0 0 1px hsl(0 0% 100% / 0.06), 0 1px 0 hsl(0 0% 100% / 0.08)'
          : 'inset 0 2px 5px #000, inset 0 0 0 1px hsl(0 0% 100% / 0.06), 0 1px 0 hsl(0 0% 100% / 0.7), 0 0 0 0.5px hsl(24 40% 20% / 0.25)',
      }}
    >
      <span
        aria-hidden="true"
        className="absolute left-1 top-1 flex h-8 w-8 items-center justify-center rounded-[10px] transition-transform [transition-duration:420ms] [transition-timing-function:cubic-bezier(0.34,1.2,0.64,1)] group-active:scale-[0.92]"
        style={{
          transform: `translateX(${dark ? 32 : 0}px)`,
          background: 'linear-gradient(180deg, #4A433D, #2A2522)',
          boxShadow: dark
            ? 'inset 0 1px 0 hsl(0 0% 100% / 0.25), 0 0 0 1px hsl(186 90% 62% / 0.9), 0 0 10px 1px hsl(186 90% 62% / 0.55), 0 6px 10px -4px #000'
            : 'inset 0 1px 0 hsl(0 0% 100% / 0.25), 0 0 0 1px hsl(21 90% 53% / 0.9), 0 0 10px 1px hsl(21 90% 53% / 0.55), 0 6px 10px -4px #000',
          transition: 'transform 420ms cubic-bezier(0.34,1.2,0.64,1), box-shadow 300ms',
        }}
      >
        <span className="relative grid h-[22px] w-[22px] grid-cols-[repeat(11,2px)]">
          {Array.from({ length: N * N }, (_, i) => {
            const row = Math.floor(i / N);
            const col = i % N;
            const isOn = on(map, i);
            const wasOn = on(before, i);
            const changed = isOn !== wasOn;
            const delay = changed ? (col + row) * 14 + jitter[i] : 0;
            return (
              <i
                key={i}
                className="block h-[2px] w-[2px]"
                style={{
                  background: color,
                  opacity: isOn ? 1 : 0,
                  transform: isOn ? 'none' : wasOn ? `translate(${col < 5 ? -3 : 3}px, -4px)` : 'scale(0)',
                  transition: `opacity 180ms ease ${isOn ? delay + 160 : delay}ms, transform 180ms ease ${isOn ? delay + 160 : delay}ms, background 300ms`,
                }}
              />
            );
          })}
        </span>
      </span>
    </button>
  );
};
