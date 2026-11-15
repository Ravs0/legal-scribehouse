import { cn } from '@/lib/utils';

interface StampProps {
  children: React.ReactNode;
  sub?: string;
  /** Plays the "thunk" animation when it mounts. */
  animate?: boolean;
  className?: string;
}

/** Double-bordered, rotated customs stamp. */
export const Stamp = ({ children, sub, animate = true, className }: StampProps) => (
  <span className={cn('stamp', animate && 'stamp-animate', className)}>
    <span className="text-lg leading-none sm:text-xl">{children}</span>
    {sub && <span className="mt-1 text-[10px] leading-none tracking-[0.2em]">{sub}</span>}
  </span>
);
