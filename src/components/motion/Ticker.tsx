import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/lib/utils';

interface TickerProps {
  items: string[];
  className?: string;
}

/** Slow marquee strip. Static and horizontally scrollable when motion is reduced. */
export const Ticker = ({ items, className }: TickerProps) => {
  const reduced = usePrefersReducedMotion();
  const line = items.map((item, i) => (
    <span key={i} className="flex shrink-0 items-center">
      <span className="px-4">{item}</span>
      <span className="text-accent" aria-hidden="true">
        ///
      </span>
    </span>
  ));

  if (reduced) {
    return (
      <div className={cn('overflow-x-auto', className)}>
        <div className="flex w-max py-3 font-mono text-xs uppercase tracking-[0.12em]">{line}</div>
      </div>
    );
  }

  return (
    <div className={cn("ticker overflow-hidden", className)} role="marquee" tabIndex={0} aria-label={items.join(", ")}>
      <div className="ticker-track flex w-max py-3 font-mono text-xs uppercase tracking-[0.12em]" aria-hidden="true">
        {line}
        {line}
      </div>
    </div>
  );
};
