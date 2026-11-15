import * as React from 'react';
import { Check, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { spawnRipple } from '@/hooks/useRipple';

interface FilterChipProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  selected: boolean;
}

/** M3 filter chip: 36px, pill, check icon when selected. */
export const FilterChip = React.forwardRef<HTMLButtonElement, FilterChipProps>(
  ({ selected, className, children, onPointerDown, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-pressed={selected}
      onPointerDown={(e) => {
        onPointerDown?.(e);
        if (e.button === 0) spawnRipple(e.currentTarget, e.clientX, e.clientY);
      }}
      className={cn(
        'state-layer type-label-md relative inline-flex h-9 shrink-0 items-center gap-1.5 overflow-hidden rounded-full transition-colors duration-short3 ease-standard',
        selected
          ? 'lip bg-primary-container pl-2.5 pr-4 text-primary-on-container'
          : 'border border-outline-variant px-4 text-foreground',
        className,
      )}
      {...props}
    >
      {selected && <Check className="h-4 w-4" aria-hidden="true" />}
      {children}
    </button>
  ),
);
FilterChip.displayName = 'FilterChip';

interface AssistChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  icon?: LucideIcon;
}

/** Non-interactive assist chip: 32px, glass-subtle, leading primary icon. */
export const AssistChip = ({ icon: Icon, className, children, ...props }: AssistChipProps) => (
  <span
    className={cn('glass-subtle type-label-md inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-foreground', className)}
    {...props}
  >
    {Icon && <Icon className="h-4 w-4 text-primary" aria-hidden="true" />}
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
  primary: 'bg-primary-container text-primary-on-container',
  tertiary: 'bg-tertiary-container text-tertiary-on-container',
  destructive: 'bg-destructive/[0.16] text-destructive',
  success: 'bg-success/[0.16] text-success',
};

/** 48px (or 40px) rounded-md tonal square holding a 24px (or 20px) icon. */
export const IconContainer = ({ icon: Icon, size = 'md', tone = 'primary', className }: IconContainerProps) => (
  <span
    aria-hidden="true"
    className={cn(
      'pebble inline-flex shrink-0 items-center justify-center',
      size === 'md' ? 'h-12 w-12' : 'h-10 w-10',
      TONES[tone],
      className,
    )}
  >
    <Icon className={size === 'md' ? 'h-6 w-6' : 'h-5 w-5'} strokeWidth={1.75} />
  </span>
);
