import { CSSProperties, ElementType, ReactNode, useEffect, useRef, useState } from 'react';
import { observeOnce } from '@/lib/reveal';

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  /** Kept for API compatibility. The stagger step now comes from the order in which siblings enter together. */
  index?: number;
  /**
   * Reveal the direct children one after another (70ms steps, max 6) instead of the wrapper as a whole.
   * The wrapper itself does not move, so children keep their own hover transforms.
   */
  stagger?: boolean;
  className?: string;
  style?: CSSProperties;
  id?: string;
}

/**
 * v3.7 scroll reveal: opacity 0→1 and translateY 24px→0 over 600ms (--ease-out) the first time 15% is visible.
 * Elements that enter in the same frame stagger by 70ms (max 6 steps). Hidden only while `html.motion-ok` is set
 * (JS running, motion allowed), so content is visible without JS or with reduced motion. The motion is a CSS
 * animation with fill-mode `backwards`, so nothing lingers afterwards. See src/lib/reveal.ts for the fallbacks.
 */
export const Reveal = ({ children, as: Tag = 'div', stagger = false, className, style, id }: RevealProps) => {
  const ref = useRef<HTMLElement>(null);
  const [order, setOrder] = useState<number | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || order !== null) return;
    return observeOnce(el, (n) => setOrder(n));
  }, [order]);
  const inView = order !== null;
  return (
    <Tag
      ref={ref}
      id={id}
      data-reveal={stagger ? 'group' : 'self'}
      data-in={inView}
      className={className}
      style={order ? ({ ...style, '--i': Math.min(order, 6) } as CSSProperties) : style}
    >
      {children}
    </Tag>
  );
};
