import { Fragment, useLayoutEffect, useRef, useState } from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { Check, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export const NOT_SURE = 'Not sure yet';

interface MarketsSelectProps {
  id: string;
  /** id of the visible field label; the trigger is named by it plus its own value text. */
  labelId: string;
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}

/**
 * v3.7 multi-select drop-down that looks exactly like the single selects (44px recessed well, 12px radius,
 * 16px chevron). The menu stays open while ticking items; Escape or an outside click closes it.
 * "Not sure yet" is exclusive: choosing it clears the markets, choosing a market clears it.
 */
export const MarketsSelect = ({ id, labelId, options, value, onChange, placeholder = 'Select markets' }: MarketsSelectProps) => {
  const order = [...options, NOT_SURE];
  const sorted = (list: string[]) => [...list].sort((a, b) => order.indexOf(a) - order.indexOf(b));

  const toggle = (item: string) => {
    if (item === NOT_SURE) return onChange(value.includes(NOT_SURE) ? [] : [NOT_SURE]);
    const base = value.filter((v) => v !== NOT_SURE);
    onChange(sorted(base.includes(item) ? base.filter((v) => v !== item) : [...base, item]));
  };

  // Show as many names as fit on one line, then "+N" for the rest (e.g. "Malaysia, Vietnam +2").
  const boxRef = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value.length);
  const [boxW, setBoxW] = useState(0);
  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([e]) => setBoxW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el || !value.length) return setShown(value.length);
    const ctx = document.createElement('canvas').getContext('2d');
    if (!ctx) return setShown(value.length);
    const cs = getComputedStyle(el);
    ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const width = boxW || el.clientWidth;
    let k = value.length;
    for (; k > 1; k--) {
      const rest = value.length - k;
      const text = value.slice(0, k).join(', ') + (rest ? ` +${rest}` : '');
      if (ctx.measureText(text).width <= width - 2) break;
    }
    setShown(k);
  }, [value, boxW]);

  const rest = value.length - shown;
  const valueId = `${id}-value`;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          id={id}
          type="button"
          aria-labelledby={`${labelId} ${valueId}`}
          className="press-soft group type-body-md recessed flex h-11 w-full items-center justify-between gap-2 rounded-[12px] px-3.5 text-left text-foreground focus:outline-none focus-visible:outline-none"
        >
          <span ref={boxRef} id={valueId} className={cn('flex min-w-0 flex-1 items-center gap-1', !value.length && 'text-muted-foreground/70')}>
            {value.length ? (
              <>
                <span className="min-w-0 truncate">{value.slice(0, shown).join(', ')}</span>
                {rest > 0 && (
                  <span className="shrink-0 text-muted-foreground">
                    +{rest}
                    <span className="sr-only"> more</span>
                  </span>
                )}
              </>
            ) : (
              placeholder
            )}
          </span>
          <ChevronDown
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={6}
        aria-labelledby={labelId}
        className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-[min(320px,var(--radix-dropdown-menu-content-available-height))] overflow-y-auto overscroll-contain"
      >
        {[...options, NOT_SURE].map((item) => {
          const checked = value.includes(item);
          return (
            <Fragment key={item}>
              {item === NOT_SURE && <DropdownMenuSeparator />}
              <DropdownMenuPrimitive.CheckboxItem
                checked={checked}
                onCheckedChange={() => toggle(item)}
                onSelect={(e) => e.preventDefault()}
                className="press-soft type-body-md relative flex h-11 cursor-pointer select-none items-center gap-3 rounded-[10px] pl-2.5 pr-3 text-foreground outline-none transition-colors focus:bg-secondary lg:h-10"
              >
                <span
                  aria-hidden="true"
                  data-state={checked ? 'checked' : 'unchecked'}
                  className="check-well flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px]"
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                </span>
                {item}
              </DropdownMenuPrimitive.CheckboxItem>
            </Fragment>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
