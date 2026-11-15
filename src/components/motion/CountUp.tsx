import { useEffect, useRef, useState } from 'react';
import { useInView } from '@/hooks/useInView';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface CountUpProps {
  value: number;
  suffix?: string;
  durationMs?: number;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export const CountUp = ({ value, suffix = '', durationMs = 1200 }: CountUpProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { threshold: 0.5 });
  const reduced = usePrefersReducedMotion();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setCurrent(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      setCurrent(Math.round(easeOutCubic(t) * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, value, durationMs]);

  return (
    <span ref={ref} className="tabular-nums">
      <span className="sr-only">
        {value}
        {suffix}
      </span>
      <span aria-hidden="true">
        {current}
        {suffix}
      </span>
    </span>
  );
};
