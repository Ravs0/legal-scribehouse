import { useEffect, useRef, useState } from 'react';
import { useInView } from '@/hooks/useInView';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/lib/utils';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#';
const TICK_MS = 30;
const TOTAL_MS = 600;

interface ScrambleTextProps {
  text: string;
  className?: string;
  /** Change this to re-run the decode (e.g. when a new country is picked). */
  replayKey?: string | number;
}

/**
 * Decodes from random glyphs to the final text, left to right.
 * The real text sits in an sr-only span; the animated copy is aria-hidden.
 */
export const ScrambleText = ({ text, className, replayKey }: ScrambleTextProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref);
  const reduced = usePrefersReducedMotion();
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!inView || reduced) {
      setDisplay(text);
      return;
    }
    const steps = Math.ceil(TOTAL_MS / TICK_MS);
    let step = 0;
    const id = window.setInterval(() => {
      step += 1;
      const settled = Math.floor((step / steps) * text.length);
      setDisplay(
        text
          .split('')
          .map((ch, i) =>
            i < settled || ch === ' ' ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
          )
          .join(''),
      );
      if (step >= steps) {
        window.clearInterval(id);
        setDisplay(text);
      }
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [inView, reduced, text, replayKey]);

  return (
    <span ref={ref} className={cn('relative inline-block whitespace-nowrap', className)}>
      <span className="sr-only">{text}</span>
      {/* Invisible final text reserves the width so the decode never reflows its line. */}
      <span aria-hidden="true" className="invisible">
        {text}
      </span>
      <span aria-hidden="true" className="absolute left-0 top-0">
        {display}
      </span>
    </span>
  );
};
