import { BadgePercent, Check, ShieldCheck, Ship } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { IconContainer } from '@/components/ui/chip';
import { cn } from '@/lib/utils';
import { tilt } from '@/hooks/usePointerGlow';

const CHECKS = [
  { label: 'Structure agreed', at: 900 },
  { label: 'Contract signed', at: 1500 },
  { label: 'Product registered', at: 2100 },
  { label: 'Customs clearance', at: null },
];

/**
 * Hero visual: an illustrative shipment passing its legal checkpoints.
 * Runs once (route draws, checks complete, bar fills); reduced motion shows the final state.
 */
export const ClearanceConsole = ({ className }: { className?: string }) => (
  <div aria-hidden="true" className={cn('relative mx-auto w-full max-w-[400px] lg:max-w-[520px]', className)}>
    {/* Satellites */}
    <div className="absolute -left-6 top-[72px] z-10 hidden animate-float-a sm:block">
      <div className="glass-subtle lip flex items-center gap-2 rounded-lg px-4 py-3">
        <BadgePercent className="h-5 w-5 text-tertiary" />
        <span className="type-label-md">Duty 0% with origin proof</span>
      </div>
    </div>
    <div className="absolute -bottom-7 -right-5 z-10 hidden animate-float-b sm:block">
      <div className="glass-subtle lip flex items-center gap-2 rounded-lg px-4 py-3">
        <ShieldCheck className="h-5 w-5 text-success" />
        <span className="type-label-md">Trademark filed</span>
      </div>
    </div>

    <div className="animate-float-slow">
    <div {...tilt} className="glass liquid-sheen lift-card animate-rise-in rounded-xl p-6 shadow-elevation-4 [animation-delay:200ms] hover:shadow-elevation-5 lg:rounded-2xl">
      <div className="flex items-start gap-3">
        <IconContainer icon={Ship} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="type-title-md truncate">Shipment · Skincare, 2 pallets</p>
          <p className="type-body-sm text-muted-foreground">Melbourne → Port Klang, MY</p>
        </div>
        <Badge variant="secondary" className="hidden sm:inline-flex">
          Illustrative example
        </Badge>
      </div>

      <svg viewBox="0 0 472 120" className="mt-4 w-full" fill="none">
        <defs>
          <linearGradient id="route-grad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="hsl(var(--aurora-1))" />
            <stop offset="1" stopColor="hsl(var(--aurora-2))" />
          </linearGradient>
        </defs>
        <path d="M24 96 C 140 8, 332 8, 448 96" stroke="hsl(var(--outline-variant))" strokeWidth="2.5" strokeLinecap="round" />
        <path
          d="M24 96 C 140 8, 332 8, 448 96"
          pathLength={1}
          stroke="url(#route-grad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="1"
          className="[animation:route-draw_1600ms_cubic-bezier(0.2,0,0,1)_600ms_both]"
        />
        <circle cx="24" cy="96" r="6" fill="hsl(var(--primary))" />
        <circle cx="448" cy="96" r="6" fill="hsl(var(--tertiary))" />
        {/* Travelling dot, parked at ~75% of the route */}
        <g className="animate-pop-in [animation-delay:2000ms]">
          <circle cx="349" cy="47" r="10" fill="hsl(var(--primary))" opacity="0.3" />
          <circle cx="349" cy="47" r="4" fill="white" stroke="hsl(var(--primary))" strokeWidth="2" />
        </g>
      </svg>

      <ul className="mt-2 divide-y divide-outline-variant">
        {CHECKS.map((c) => {
          const done = c.at !== null;
          return (
            <li key={c.label} className="flex h-11 items-center gap-3">
              <span className="relative flex h-6 w-6 shrink-0 items-center justify-center">
                {done ? (
                  <span
                    className="flex h-6 w-6 animate-pop-in items-center justify-center rounded-full bg-success text-background"
                    style={{ animationDelay: `${c.at}ms` }}
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                ) : (
                  <>
                    <span className="absolute inset-0 animate-pulse-ring rounded-full border-2 border-primary" />
                    <span className="h-6 w-6 rounded-full border-2 border-primary" />
                  </>
                )}
              </span>
              <span className="type-label-lg flex-1">{c.label}</span>
              <span className={cn('type-label-sm', done ? 'text-success' : 'text-primary')}>
                {done ? 'Done' : 'In progress'}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="mt-4">
        <div className="h-1.5 overflow-hidden rounded-full bg-surface-high">
          <div
            className="h-full w-3/4 origin-left rounded-full [animation:bar-fill_1200ms_cubic-bezier(0.2,0,0,1)_900ms_both]"
            style={{ background: 'linear-gradient(90deg, hsl(var(--aurora-1)), hsl(var(--aurora-2)))' }}
          />
        </div>
        <p className="type-label-md mt-2 text-muted-foreground">3 of 4 checks cleared</p>
      </div>
    </div>
    </div>
  </div>
);
