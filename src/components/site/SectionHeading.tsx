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
  /** Extra content under the subtitle (e.g. a badge). */
  children?: ReactNode;
  /** Section number shown in the margin ("01"…). */
  index?: string;
}

/**
 * v4.1 editorial margin heading. A hairline runs the full width and draws in from the left when the heading enters.
 * From 1024px: the margin (columns 1–3) holds the serif section number and the label; the title and subtitle hang
 * from column 4. Below 1024px: number and label share one row above the title.
 */
export const SectionHeading = ({ eyebrow, title, subtitle, className, as: H = 'h2', children, index }: SectionHeadingProps) => (
  <Reveal className={cn('section-heading sh-draw relative grid-12 pt-5 md:pt-6', className)}>
    <span aria-hidden="true" className="sh-rule absolute inset-x-0 top-0 h-px bg-border" />
    <div className="sh-margin col-span-4 flex items-baseline gap-3 md:col-span-12 lg:col-span-3 lg:flex-col lg:gap-2">
      {index && <span className="sh-num tabular">{index}</span>}
      <Eyebrow>{eyebrow}</Eyebrow>
    </div>
    <div className="sh-body col-span-4 md:col-span-12 lg:col-span-9 lg:col-start-4">
      <H className={cn('mt-3 lg:mt-0', H === 'h1' ? 'type-display-md max-w-[20ch]' : 'type-headline-lg max-w-[20ch]')}>{title}</H>
      {subtitle && <p className="type-body-lg mt-4 max-w-[54ch] text-muted-foreground">{subtitle}</p>}
      {children}
    </div>
  </Reveal>
);
