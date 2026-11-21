import { CSSProperties, Fragment, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { Eyebrow } from '@/components/site/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { ArrowRight } from 'lucide-react';
import { ClearancePrinter } from '@/components/home/ClearancePrinter';
import { Button } from '@/components/ui/button';
import { HashLink } from '@/components/site/HashLink';
import { SectionHeading } from '@/components/site/SectionHeading';
import { cn } from '@/lib/utils';
import { prefersReducedMotion } from '@/lib/reveal';
import { CountUp } from '@/components/motion/CountUp';

// v4.0 "Regional desk": the four promises under the hero. Confirm each with the firm before launch.
const PROMISES: { n: string; count?: number; label: string }[] = [
  { n: '1', count: 1, label: 'point of contact for every market' },
  { n: '10', count: 10, label: 'markets, local counsel vetted by us' },
  { n: '1 day', label: 'to a first answer on any market question' },
  { n: 'Fixed', label: 'fee per job, quoted before work starts' },
];

// Placeholder desk: where the work is done. Replace "Local counsel" lines with the real partner firms.
const DESK = [
  { code: 'SG · Hub', name: 'Singapore', note: 'Our office · contracts seat' },
  { code: 'MY', name: 'Malaysia', note: 'Local counsel · Kuala Lumpur' },
  { code: 'ID', name: 'Indonesia', note: 'Local counsel · Jakarta' },
  { code: 'VN', name: 'Vietnam', note: 'Local counsel · Ho Chi Minh City' },
  { code: 'TH', name: 'Thailand', note: 'Local counsel · Bangkok' },
  { code: 'PH', name: 'Philippines', note: 'Local counsel · Manila' },
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

const HEADLINE = 'One desk for all ten ASEAN markets.';

/** Cycles a highlight through the desk tiles (2.4s steps). Pauses on hover/focus; off with reduced motion. */
const useDeskCycle = (n: number) => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || prefersReducedMotion()) return;
    const t = window.setInterval(() => setActive((a) => (a + 1) % n), 2400);
    return () => window.clearInterval(t);
  }, [paused, n]);
  return { active, setActive, pause: () => setPaused(true), resume: () => setPaused(false) };
};

export const Hero = () => {
  const desk = useDeskCycle(DESK.length);
  const [route, setRoute] = useState(0);
  return (
  <section id="hero" className="pb-4 pt-8 md:pb-6 lg:pt-14">
    <div className="container">
      {/* v5.1: the printer is back in the hero, on the left (the layout chosen in v3.8). Text and the route picker on
          the right. DOM order stays text first for phones and screen readers. */}
      <div className="grid-12 items-center gap-y-10">
        <div className="col-span-4 md:col-span-12 md:max-w-[680px] lg:order-2 lg:col-span-7 lg:max-w-none lg:pl-6">
          <div className="intro" style={step(0)}>
            <Eyebrow>Singapore · Kuala Lumpur · Jakarta · Ho Chi Minh City</Eyebrow>
          </div>
          <h1 className="hero-words type-hero mt-5 max-w-[15ch]" aria-label={HEADLINE}>
            {HEADLINE.split(' ').map((w, i) => (
              <Fragment key={i}>
                <span aria-hidden="true" className="hw">
                  <span style={{ '--w': i } as CSSProperties}>{w}</span>
                </span>{' '}
              </Fragment>
            ))}
          </h1>
          <p className="intro type-body-lg mt-6 max-w-[52ch] text-muted-foreground md:text-[19px] md:leading-[1.6]" style={step(4)}>
            We run your export from Singapore and brief vetted local counsel in every market, so you deal with one firm,
            one fee and one person who knows your file.
          </p>
          <div className="intro mt-7" style={step(5)}>
            <p className="type-eyebrow text-muted-foreground">Try a route</p>
            <div className="mt-2">
              <RoutePicker value={route} onChange={setRoute} />
            </div>
            <p className="type-body-sm mt-2.5 text-muted-foreground">Pick one and the printer shows the duty an origin claim would save.</p>
          </div>
          <div className="intro mt-7 flex flex-wrap gap-3" style={step(6)}>
            <Button asChild size="lg" icon="trailing">
              <HashLink to="contact">
                Book a free call <ArrowRight aria-hidden="true" />
              </HashLink>
            </Button>
            <Button asChild size="lg" variant="outline">
              <HashLink to="process">How we work</HashLink>
            </Button>
          </div>
        </div>
        <div className="col-span-4 md:col-span-12 lg:order-1 lg:col-span-5">
          <div className="intro-printer">
            <ClearancePrinter className="float-idle lg:ml-0" selected={route} onSelect={setRoute} />
          </div>
        </div>
      </div>

      {/* The desk: who handles each market. One row of six from 1024px; the highlight cycles every 2.4s. */}
      <Reveal className="mt-14 md:mt-16">
        <p className="type-label-md mb-3 text-muted-foreground">Where the work is done</p>
        <ul
          aria-label="Where the work is done"
          onPointerEnter={desk.pause}
          onPointerLeave={desk.resume}
          onFocus={desk.pause}
          onBlur={desk.resume}
          className="desk-grid surface-2 grid grid-cols-2 overflow-hidden rounded-[14px] bg-border [gap:1px] md:grid-cols-3 lg:grid-cols-6"
        >
          {DESK.map((d, i) => (
            <li key={d.name} data-active={desk.active === i} onPointerEnter={() => desk.setActive(i)} className="desk-tile relative bg-card px-4 py-4">
              <p className="type-mono-sm flex items-center gap-2 text-muted-foreground">
                {d.code}
                <span aria-hidden="true" className="desk-live h-1.5 w-1.5 rounded-full bg-primary" />
              </p>
              <p className="type-title-md mt-1.5">{d.name}</p>
              <p className="type-body-sm mt-0.5 text-muted-foreground">{d.note.replace('Local counsel · ', '')}</p>
            </li>
          ))}
          <li className="type-body-sm col-span-2 bg-card px-4 py-3 text-muted-foreground md:col-span-3 lg:col-span-6">
            + Cambodia, Laos, Myanmar and Brunei through referral counsel. Local counsel in each market is briefed and managed by us.
          </li>
        </ul>
      </Reveal>

      <Reveal as="dl" stagger className="mt-10 grid grid-cols-2 border-t border-border md:mt-12 lg:grid-cols-4">
        {PROMISES.map((p, i) => (
          <div
            key={p.label}
            className={cn(
              'flex flex-col py-6 pr-4 md:pr-6',
              i % 2 === 1 && 'border-l border-border pl-4 md:pl-6',
              i >= 2 && 'border-t border-border lg:border-t-0',
              i === 2 && 'lg:border-l lg:pl-6',
            )}
          >
            <dt className="type-body-sm order-2 mt-1 text-muted-foreground">{p.label}</dt>
            <dd className="type-stat order-1 text-primary-ink">{p.count ? <CountUp value={p.count} durationMs={900} /> : p.n}</dd>
          </div>
        ))}
      </Reveal>
    </div>
  </section>
  );
};

/** v5.1: the three failure modes as their own short section (the printer now lives in the hero). */
export const RouteDemo = () => (
  <section id="route" className="section band">
    <div className="container">
      <SectionHeading
        index="05"
        eyebrow="Why exports stall"
        title="Three ways a first shipment goes wrong."
        subtitle="None of them is expensive to prevent. All of them are expensive to fix after the goods have left."
      />
      <ol className="after-heading stack-gap grid md:grid-cols-3">
        {PROBLEMS.map((p, i) => (
          <Reveal as="li" key={p.title} index={i} className="surface-1 card-hover rounded-[12px] p-5">
            <span className="sh-num text-[40px]">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="type-title-lg mt-3">{p.title}</h3>
            <p className="type-body-md mt-2 text-muted-foreground">{p.copy}</p>
          </Reveal>
        ))}
      </ol>
    </div>
  </section>
);
