import { CSSProperties, KeyboardEvent, useRef, useState } from 'react';
import { AssistChip } from '@/components/ui/chip';
import { Eyebrow } from '@/components/site/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { ClearancePrinter } from '@/components/home/ClearancePrinter';
import { cn } from '@/lib/utils';

const STATS = [
  { n: '10', label: 'markets covered' },
  { n: '6', label: 'fixed-scope services' },
  { n: '30-min', label: 'free first call' },
];

const PROBLEMS = [
  {
    title: 'Stuck at the port',
    copy: 'The HS code or permit was wrong, so the goods sit in a warehouse while storage fees add up.',
  },
  {
    title: 'Brand registered by someone else',
    copy: 'A distributor filed your trademark before you did, and now holds it in that country.',
  },
  {
    title: 'Duty overpaid',
    copy: "A trade agreement would have cut the duty, but the origin paperwork wasn't in order.",
  },
];

// Order matches the printer presets: MY, ID, VN.
const ROUTES = [
  { country: 'Malaysia', product: 'cosmetics' },
  { country: 'Indonesia', product: 'biscuits' },
  { country: 'Vietnam', product: 'T-shirts' },
];

// v3.7 first paint: hero items stagger in after the header (70ms steps, see .intro in index.css).
const step = (i: number) => ({ '--i': i }) as CSSProperties;

/** Segmented control that drives the hero printer (roving tabindex, arrow keys). */
const RoutePicker = ({ value, onChange }: { value: number; onChange: (i: number) => void }) => {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const n = ROUTES.length;
    let next: number | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (value + 1) % n;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (value - 1 + n) % n;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = n - 1;
    if (next === null) return;
    e.preventDefault();
    onChange(next);
    refs.current[next]?.focus();
  };
  return (
    <div
      role="radiogroup"
      aria-label="Example route"
      onKeyDown={onKeyDown}
      className="recessed inline-flex h-11 max-w-full items-center rounded-full p-1 [background-color:var(--well-fill)]"
    >
      {ROUTES.map((r, i) => {
        const on = i === value;
        return (
          <button
            key={r.country}
            ref={(el) => (refs.current[i] = el)}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(i)}
            className={cn(
              'press hit type-label-md relative h-9 shrink-0 whitespace-nowrap rounded-full px-[14px] transition-[color,background-color,box-shadow,transform] [transition-duration:200ms]',
              on ? 'surface-1 text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {r.country}
            <span className="max-[479px]:hidden"> · {r.product}</span>
          </button>
        );
      })}
    </div>
  );
};

export const Hero = () => {
  const [route, setRoute] = useState(0);
  return (
    <section id="hero" className="pb-8 pt-6 lg:pb-12 lg:pt-10">
      <div className="container">
        <div className="grid-12 items-center gap-y-8">
          {/* v3.8 mirrored: from 1024 the printer takes the left 5 columns (flush with the container edge) and the text
              the right 7. DOM order stays text first for phones, tablets and screen readers.
              768–1023: text block capped at 640px, printer centred below it. */}
          <div className="col-span-4 md:col-span-12 md:max-w-[640px] lg:order-2 lg:col-span-7 lg:max-w-none hero-text">
            <div className="intro" style={step(0)}>
              <AssistChip>Export law for small brands · ASEAN</AssistChip>
            </div>
            <h1 className="intro type-display-lg mt-4 max-w-[19.5ch] text-foreground lg:max-w-none" style={step(1)}>
              Export to Southeast Asia.{' '}
              <br className="hidden lg:inline" />
              Get it right the first time.
            </h1>
            <p className="intro type-body-lg mt-4 max-w-[52ch] text-muted-foreground" style={step(2)}>
              We sort out the structure, contracts, customs and product registration before your first shipment leaves,
              and explain each step in plain English.
            </p>
            <div className="intro mt-6" style={step(3)}>
              <p className="type-eyebrow text-muted-foreground">Try a route</p>
              <div className="mt-2">
                <RoutePicker value={route} onChange={setRoute} />
              </div>
              <p className="type-body-sm mt-2.5 text-muted-foreground">Pick one and the printer shows the duty an origin claim would save.</p>
            </div>
            <ul className="intro mt-5 flex flex-wrap gap-2" style={step(4)}>
              {STATS.map((s) => (
                <li key={s.label} className="surface-1 type-label-md inline-flex h-8 items-center gap-2 rounded-full px-3">
                  <span className="font-bold text-primary-ink tabular">{s.n}</span>
                  <span>{s.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-4 md:col-span-12 lg:order-1 lg:col-span-5 hero-art">
            <div className="intro-printer">
              <ClearancePrinter className="float-idle lg:ml-0" selected={route} onSelect={setRoute} />
            </div>
          </div>
        </div>

        <Reveal className="mt-8 lg:mt-10">
          <div id="problems" className="surface-2 rounded-[24px]">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-4 pt-4 md:px-5">
              <Eyebrow>Why exports stall</Eyebrow>
              <h2 className="type-label-md text-muted-foreground">Three ways a first shipment goes wrong</h2>
            </div>
            {/* v3.8 anatomy: a dot + title row; the body hangs from the title's left edge. */}
            <ul className="mt-1 grid divide-y divide-outline-variant md:grid-cols-3 md:divide-x md:divide-y-0">
              {PROBLEMS.map((p) => (
                <li key={p.title} className="grid grid-cols-[8px_minmax(0,1fr)] content-start items-center gap-x-3 p-4 md:p-5">
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 rounded-full bg-destructive"
                    style={{ boxShadow: '0 0 0 3px hsl(var(--destructive) / .14)' }}
                  />
                  <h3 className="type-title-sm">{p.title}</h3>
                  <p className="type-body-sm col-start-2 mt-1 text-muted-foreground">{p.copy}</p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
