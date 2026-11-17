import { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/*
 * v3.8 card anatomy (docs/DESIGN.md "v3.8"), shared by every content card:
 *   .card-shell   padding 20px (24px for large panels with .card-shell-lg), flex column, container for the meta fallback
 *   CardHeader    40px well (20px icon or a mono numeral) + title (type-title-lg, first line centred on the well)
 *                 + optional mono meta right-aligned on the same row, 12px gaps
 *   .card-body    type-body-md, muted, 12px below the header
 *   CardFooter    pinned to the bottom (mt-auto), 16px top padding over a hairline
 */

interface CardHeaderProps {
  icon?: LucideIcon;
  /** Mono numeral (or any short glyph) shown in the well instead of an icon. */
  numeral?: ReactNode;
  title: ReactNode;
  meta?: ReactNode;
  as?: 'h2' | 'h3' | 'p';
  /** Tone of the icon / numeral in the well. */
  tone?: string;
  className?: string;
  titleClassName?: string;
}

export const CardWell = ({ icon: Icon, numeral, tone = 'text-primary-ink' }: Pick<CardHeaderProps, 'icon' | 'numeral' | 'tone'>) => (
  <span aria-hidden="true" className={cn('card-well icon-well', tone)}>
    {Icon ? <Icon className="h-5 w-5" strokeWidth={2} /> : <span className="card-numeral tabular">{numeral}</span>}
  </span>
);

export const CardHeader = ({ icon, numeral, title, meta, as: T = 'h3', tone, className, titleClassName }: CardHeaderProps) => (
  <div className={cn('card-head', className)}>
    <CardWell icon={icon} numeral={numeral} tone={tone} />
    <T className={cn('card-title type-title-lg', titleClassName)}>{title}</T>
    {meta != null && <span className="card-meta type-mono-sm text-muted-foreground">{meta}</span>}
  </div>
);

export const CardFooter = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn('card-foot', className)}>{children}</div>
);
