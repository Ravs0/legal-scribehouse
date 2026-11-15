import { ElementType, ReactNode, useRef } from 'react';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  /** Position in a staggered group; each step adds 60ms (capped at 6 steps). */
  index?: number;
  className?: string;
}

/** Fades and lifts its content into place the first time it scrolls into view. */
export const Reveal = ({ children, as: Tag = 'div', index = 0, className }: RevealProps) => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);
  return (
    <Tag
      ref={ref}
      data-in={inView}
      className={cn('reveal', className)}
      style={{ transitionDelay: inView ? `${Math.min(index, 6) * 60}ms` : undefined }}
    >
      {children}
    </Tag>
  );
};
