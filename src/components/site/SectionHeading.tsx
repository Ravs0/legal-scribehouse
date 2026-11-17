import { ReactNode } from 'react';
import { Reveal } from '@/components/motion/Reveal';
import { cn } from '@/lib/utils';

export const Eyebrow = ({ children, className }: { children: ReactNode; className?: string }) => (
  <p className={cn('type-eyebrow flex items-center gap-2 text-primary-ink', className)}>
    <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
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
 * v3.8: every section heading is a centred block above its content.
 * Eyebrow (dot + label) → 10px → h2 (24ch, balanced) → 10px → subtitle (56ch). Content follows `.after-heading`.
 */
export const SectionHeading = ({ eyebrow, title, subtitle, className, as: H = 'h2', children }: SectionHeadingProps) => (
  <Reveal stagger className={cn('section-heading mx-auto flex flex-col items-center text-center', className)}>
    <Eyebrow className="justify-center">{eyebrow}</Eyebrow>
    <H className={cn('mx-auto mt-2.5', H === 'h1' ? 'type-display-md max-w-[20ch]' : 'type-headline-lg max-w-[24ch]')}>{title}</H>
    {subtitle && <p className="type-body-lg mx-auto mt-2.5 max-w-[56ch] text-muted-foreground">{subtitle}</p>}
    {children}
  </Reveal>
);
