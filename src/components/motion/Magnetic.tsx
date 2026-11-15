import { MouseEvent, ReactNode, useRef } from 'react';
import { cn } from '@/lib/utils';

const STRENGTH = 0.25;
const MAX = 8; // px

/** Pulls its child gently toward the pointer (desktop pointers only, off for reduced motion). */
export const Magnetic = ({ children, className }: { children: ReactNode; className?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const enabled = () =>
    window.matchMedia('(hover: hover) and (min-width: 1024px)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const onMove = (e: MouseEvent<HTMLSpanElement>) => {
    const el = ref.current;
    if (!el || !enabled()) return;
    const r = el.getBoundingClientRect();
    const dx = Math.max(-MAX, Math.min(MAX, (e.clientX - (r.left + r.width / 2)) * STRENGTH));
    const dy = Math.max(-MAX, Math.min(MAX, (e.clientY - (r.top + r.height / 2)) * STRENGTH));
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  return (
    <span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn('inline-flex transition-transform duration-medium1 ease-emphasized', className)}
    >
      {children}
    </span>
  );
};
