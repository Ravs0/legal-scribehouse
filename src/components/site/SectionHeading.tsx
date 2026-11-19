import { ReactNode } from 'react';
import { Reveal } from '@/components/motion/Reveal';
import { cn } from '@/lib/utils';

export const Eyebrow = ({ children, className }: { children: ReactNode; className?: string }) => (
  <p className={cn('type-eyebrow flex items-center gap-2.5 text-primary-ink', className)}>
    <span aria-hidden="true" className="h-px w-6 shrink-0 bg-primary" />
    {children}
  </p>
);

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  className?: string;
  /** Heading level; sections use h2, page headers use h1. */
  as?: 'h1' | 'h2';
  /** Extra content centred under the subtitle (e.g. a badge). */
  children?: ReactNode;
}

/**
 * v3.12 corporate finish: headings are left-aligned. From 1024px the title takes the left 7 columns and the subtitle
 * sits in the right 5, bottom-aligned with the title, over one hairline that runs the full container width.
 * Eyebrow (rule + label) → 12px → h2 → subtitle. Content follows `.after-heading`.
 */
export const SectionHeading = ({ eyebrow, title, subtitle, className, as: H = 'h2', children }: SectionHeadingProps) => (
  <Reveal stagger className={cn('section-heading grid-12 items-end border-b border-border pb-6 md:pb-8', className)}>
    <div className="col-span-4 md:col-span-12 lg:col-span-7">
      <Eyebrow>{eyebrow}</Eyebrow>
      <H className={cn('mt-3', H === 'h1' ? 'type-display-md max-w-[20ch]' : 'type-headline-lg max-w-[22ch]')}>{title}</H>
      {children}
    </div>
    {subtitle && (
      <p className="type-body-lg col-span-4 max-w-[52ch] text-muted-foreground md:col-span-12 lg:col-span-5 lg:pb-1">{subtitle}</p>
    )}
  </Reveal>
);
