import { ReactNode } from 'react';
import { Reveal } from '@/components/motion/Reveal';
import { cn } from '@/lib/utils';

export const Eyebrow = ({ children, className }: { children: ReactNode; className?: string }) => (
  <p className={cn('type-eyebrow flex items-center gap-2 text-primary', className)}>
    <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-tertiary" />
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
  children?: ReactNode;
}

/** Eyebrow → 16px → h2 (headline-lg, 24ch) → 16px → subhead (body-lg, 56ch). */
export const SectionHeading = ({ eyebrow, title, subtitle, className, as: H = 'h2', children }: SectionHeadingProps) => (
  <Reveal className={className}>
    <Eyebrow>{eyebrow}</Eyebrow>
    <H className={cn('mt-4', H === 'h1' ? 'type-display-md max-w-[18ch]' : 'type-headline-lg max-w-[24ch]')}>
      {title}
    </H>
    {subtitle && <p className="type-body-lg mt-4 max-w-[56ch] text-muted-foreground">{subtitle}</p>}
    {children}
  </Reveal>
);
