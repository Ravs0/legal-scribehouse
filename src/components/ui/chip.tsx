import * as React from 'react';
import { Check, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterChipProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  selected: boolean;
}

/** Filter chip: 30px, pill. Selected = dark device pill with a check. */
export const FilterChip = React.forwardRef<HTMLButtonElement, FilterChipProps>(({ selected, className, children, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    aria-pressed={selected}
    className={cn(
      'press type-label-md inline-flex h-[30px] shrink-0 items-center gap-1.5 rounded-full px-3 transition-colors duration-150',
      selected ? 'btn-device bg-device pl-2.5 text-device-foreground' : 'btn-raised bg-card text-foreground hover:bg-secondary',
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

/** 40px (or 32px) recessed well holding a 20px (or 16px) icon. */
export const IconContainer = ({ icon: Icon, size = 'md', tone = 'primary', className }: IconContainerProps) => (
  <span
    aria-hidden="true"
    className={cn(
      'icon-well inline-flex shrink-0 items-center justify-center rounded-lg',
      size === 'md' ? 'h-10 w-10' : 'h-8 w-8 rounded-md',
      TONES[tone],
      className,
    )}
  >
    <Icon className={size === 'md' ? 'h-5 w-5' : 'h-4 w-4'} strokeWidth={1.75} />
  </span>
);
