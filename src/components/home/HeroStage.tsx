import { CSSProperties, KeyboardEvent, PointerEvent, useEffect, useRef, useState } from 'react';
import { ClearancePrinter } from '@/components/home/ClearancePrinter';
import { Crate, Plant, ShippingContainer } from '@/components/home/heroProps';
import { cn } from '@/lib/utils';
import { prefersReducedMotion } from '@/lib/reveal';

/**
 * v5.3 hero, after human-md.ai: a full-bleed room (orange wall, sand floor) with one giant word, the calculator
 * standing in front of it like a figure in front of a title, props on the floor, typed mono notes, a live clock and
 * a scroll pill. Kept from before: the calculator (ClearancePrinter) and the tactile pill buttons.
 *
 * Motion (only with motion allowed): letters drop in, props arrive, the palm sways, notes type themselves, the scene
 * shifts with the pointer and drifts on scroll. Reduced motion: everything is simply in place.
 */

const ROUTES = [
  { country: 'Malaysia', product: 'cosmetics' },
  { country: 'Indonesia', product: 'biscuits' },
  { country: 'Vietnam', product: 'T-shirts' },
];

const NOTES = ['fixed-fee export counsel. not a law factory.', 'ten asean markets. one desk in singapore.', 'last cleared: MEL → Port Klang.'];

const step = (i: number) => ({ '--i': i }) as CSSProperties;

/** Segmented route picker in the tactile finish (selected key = raised pill). Roving tabindex + arrow keys. */
const RoutePicker = ({ value, onChange }: { value: number; onChange: (i: number) => void }) => {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const n = ROUTES.length;
    let next: number | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (value + 1) % n;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (value - 1 + n) % n;
    if (next === null) return;
    e.preventDefault();
    onChange(next);
    refs.current[next]?.focus();
  };
  return (
    <div role="radiogroup" aria-label="Example route" onKeyDown={onKeyDown} className="recessed inline-flex h-11 max-w-full items-center rounded-full p-1 [background-color:var(--well-fill)]">
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
            className={cn('btn-lift hit type-label-md relative h-9 shrink-0 whitespace-nowrap rounded-full px-[14px]', on ? 'btn-raised bg-card text-foreground' : 'text-muted-foreground hover:text-foreground')}
          >
            {r.country}
            <span className="max-[479px]:hidden"> · {r.product}</span>
          </button>
        );
      })}
    </div>
  );
};

/** Singapore time, ticking. */
const useClock = () => {
  const fmt = () => new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Singapore', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date());
  const [t, setT] = useState(fmt);
  useEffect(() => {
    const id = window.setInterval(() => setT(fmt()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return t;
};

export const Hero = () => {
  const [route, setRoute] = useState(0);
  const clock = useClock();
  const stage = useRef<HTMLElement>(null);
  const raf = useRef(0);

  // Pointer parallax and scroll drift, written to CSS variables (no re-render).
  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse' || prefersReducedMotion() || !stage.current) return;
    const r = stage.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      stage.current?.style.setProperty('--px', x.toFixed(3));
      stage.current?.style.setProperty('--py', y.toFixed(3));
    });
  };
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let id = 0;
    const onScroll = () => {
      cancelAnimationFrame(id);
      id = requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, 900);
        stage.current?.style.setProperty('--sy', String(y));
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section id="hero" ref={stage} onPointerMove={onPointerMove} className="hero-stage relative overflow-hidden">
      {/* Wall and floor */}
      <div aria-hidden="true" className="hero-wall absolute inset-0" />
      <div aria-hidden="true" className="hero-floor absolute inset-x-0 bottom-0" />

      {/* Title and copy */}
      <div className="container relative z-[2] pt-8 md:pt-12 lg:pt-10">
        <div className="intro flex flex-wrap items-center justify-between gap-x-6 gap-y-1" style={step(0)}>
          <p className="type-mono-md flex items-center gap-2 text-[#2A1206]/80">
            <span>§ export law for small brands</span>
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#0F4C52]" />
            <span>asean</span>
          </p>
          <p className="type-mono-md text-[#2A1206]/80">
            <span className="tabular" aria-label={`Singapore time ${clock}`}>sgt {clock}</span>
            <span aria-hidden="true" className="mx-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#1E7A52] align-middle" />
            desk open
          </p>
        </div>
        <h1 className="hero-title mt-2" aria-label="Cleared to sell in Southeast Asia">
          <span aria-hidden="true" className="hero-word inline-block">
            {'Cleared'.split('').map((ch, i) => (
              <span key={i} className="hero-letter inline-block" style={{ '--l': i } as CSSProperties}>{ch}</span>
            ))}
            <span className="hero-dot inline-block" />
          </span>{' '}
          <span aria-hidden="true" className="hero-serif inline-block">to sell.</span>
        </h1>

        {/* v5.7: from 1024px the copy and the set are two columns of the same grid, under the headline, so the
            objects can never sit on the text at any screen width. No buttons here: "Book a free call" lives in the
            top bar and appears once you scroll past the hero. */}
        <div className="hero-body lg:grid lg:grid-cols-12 lg:gap-x-8">
          <div className="relative z-[3] mt-5 max-w-[34rem] lg:col-span-5 lg:mt-8 lg:max-w-none">
            <p className="intro hero-lede" style={step(3)}>
              We clear the route before your first shipment leaves: structure, contracts, customs and registration, in
              ten markets, for one fixed fee.
            </p>
            <div className="intro mt-7" style={step(4)}>
              <p className="type-mono-sm text-[#2A1206]/75">try a route →</p>
              <div className="mt-2">
                <RoutePicker value={route} onChange={setRoute} />
              </div>
              <p className="type-body-sm mt-3 max-w-[40ch] text-[#2A1206]/75">Pick one and the printer shows the duty an origin claim would save.</p>
            </div>
          </div>

          {/* The set. Light from the upper left: every object throws a soft shadow up-right onto the wall and sits on a
              contact shadow on the floor. The calculator rests on two crates; its receipt drapes down their front. */}
          <div className="hero-set relative z-[2] lg:col-span-7">
            <div className="prop set-container absolute" style={{ '--d': 0.8, '--k': 8 } as CSSProperties}>
              <span aria-hidden="true" className="wall-shadow" />
              <ShippingContainer className="relative h-full w-full" />
              <span aria-hidden="true" className="floor-shadow" />
            </div>
            <div className="prop set-cluster absolute" style={{ '--d': 0.3, '--k': 18 } as CSSProperties}>
              <span aria-hidden="true" className="wall-shadow" />
              <span aria-hidden="true" className="floor-shadow" />
              <Crate id="crate-a" label="FRAGILE" sub="MEL → PKG" className="crate crate-low absolute" />
              <Crate id="crate-b" sub="NO. 0412 · THIS WAY UP" className="crate crate-high absolute" />
              <div className="set-calc absolute">
                <div className="intro-printer">
                  <ClearancePrinter bare selected={route} onSelect={setRoute} />
                </div>
              </div>
            </div>
            <div className="prop set-plant absolute" style={{ '--d': 0.15, '--k': 30 } as CSSProperties}>
              <span aria-hidden="true" className="floor-shadow" />
              <Plant className="relative h-full w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Light and air: window light on the wall, a soft vignette over the whole room. */}
      <div aria-hidden="true" className="hero-light pointer-events-none absolute" />
      <div aria-hidden="true" className="hero-vignette pointer-events-none absolute inset-0 z-[1]" />

      {/* Floor notes, clock and scroll pill */}
      <div className="hero-notes relative z-[3] lg:absolute lg:inset-x-0 lg:bottom-0">
        <div className="container grid gap-4 pb-6 pt-5 lg:grid-cols-3 lg:items-end lg:pb-6 lg:pt-0">
          <ul className="space-y-1">
            {NOTES.map((n, i) => (
              <li key={n} className="type-mono-sm flex items-center gap-2 text-[#3B2A1C]">
                <span aria-hidden="true" className="h-1 w-1 shrink-0 rounded-full bg-[#E8590C]" />
                <span className="typed" style={{ '--n': n.length, '--t': i } as CSSProperties}>{n}</span>
              </li>
            ))}
          </ul>
          <span className="scroll-pill type-mono-sm hidden justify-self-center rounded-full bg-[#1F1A16] px-3 py-1.5 text-[#F4EEE6] lg:inline-block" aria-hidden="true">
            scroll ↓
          </span>
        </div>
      </div>
    </section>
  );
};
