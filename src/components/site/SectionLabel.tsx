import { useRef } from 'react';
import { useInView } from '@/hooks/useInView';
import { ScrambleText } from '@/components/motion/ScrambleText';
import { cn } from '@/lib/utils';

interface SectionLabelProps {
  index: string;
  label: string;
  className?: string;
  /** For use on the dark primary band. */
  inverse?: boolean;
}

/** The mono "field label" row that opens each section: [ 03 ]  WHERE WE WORK ──────── */
export const SectionLabel = ({ index, label, className, inverse }: SectionLabelProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  return (
    <div ref={ref} className={cn('label-mono mb-6 flex items-center gap-3', className)}>
      <span className={cn('shrink-0', inverse ? 'text-primary-foreground/70' : 'text-accent')}>[ {index} ]</span>
      <ScrambleText text={label} className={cn('shrink-0', inverse ? 'text-primary-foreground' : 'text-foreground')} />
      <span
        aria-hidden="true"
        data-in={inView}
        className={cn('rule-draw h-px flex-1', inverse ? 'bg-primary-foreground/30' : 'bg-rule')}
      />
    </div>
  );
};
