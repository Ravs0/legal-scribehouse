import * as React from 'react';
import { Check, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterChipProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  selected: boolean;
}

/** Filter chip: 30px pill in the tactile button finish. Selected = the orange filled pill with a check. */
export const FilterChip = React.forwardRef<HTMLButtonElement, FilterChipProps>(({ selected, className, children, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    aria-pressed={selected}
    className={cn(
      'press type-label-md inline-flex h-[30px] shrink-0 items-center gap-1.5 rounded-full px-3 transition-colors duration-150',
      selected ? 'btn-filled btn-lift pl-2.5 text-primary-foreground' : 'btn-raised btn-lift bg-card text-foreground',
      className,
    )}
    {...props}
  >
    {selected && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
    {children}
  </button>
));
FilterChip.displayName = 'FilterChip';

interface AssistChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  icon?: LucideIcon;
}

/** Static info chip: 28px. */
export const AssistChip = ({ icon: Icon, className, children, ...props }: AssistChipProps) => (
  <span className={cn('btn-raised type-label-md inline-flex h-7 items-center gap-1.5 rounded-full bg-card px-2.5 text-foreground', className)} {...props}>
    {Icon && <Icon className="h-3.5 w-3.5 text-primary-ink" aria-hidden="true" />}
    {children}
  </span>
);

interface IconContainerProps {
  icon: LucideIcon;
  size?: 'md' | 'sm';
  tone?: 'primary' | 'tertiary' | 'destructive' | 'success';
  className?: string;
}

const TONES = {
  primary: 'text-primary-ink',
  tertiary: 'text-tertiary',
  destructive: 'text-destructive',
  success: 'text-success',
};

/** 44px (or 36px) recessed well holding a 22px (or 18px) icon. */
export const IconContainer = ({ icon: Icon, size = 'md', tone = 'primary', className }: IconContainerProps) => (
  <span
    aria-hidden="true"
    className={cn(
      'icon-well inline-flex shrink-0 items-center justify-center [&_svg]:shrink-0',
      size === 'md' ? 'h-11 w-11 rounded-[8px]' : 'h-9 w-9 rounded-[10px]',
      TONES[tone],
      className,
    )}
  >
    <Icon className={size === 'md' ? 'h-[22px] w-[22px]' : 'h-[18px] w-[18px]'} strokeWidth={2} />
  </span>
);
