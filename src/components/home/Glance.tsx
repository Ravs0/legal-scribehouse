import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowUpRight, Check, Clock3 } from 'lucide-react';
import { MarketScene, SCENES } from '@/components/site/MarketScene';
import { SectionHeading } from '@/components/site/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { HashLink } from '@/components/site/HashLink';
import { MARKETS } from '@/data/markets';
import { cn } from '@/lib/utils';

/*
 * Home-screen-style widget board. Each widget combines a few facts and can be acted on in place:
 * click to morph it open, act inside it, Escape or click again to close. All figures are illustrative.
 */

type Id = 'duty' | 'ship' | 'deadline' | 'weather';
type Cell = [col: number, row: number, w: number, h: number];

const LAYOUT: Record<'wide' | 'narrow', { cols: number; rows: number; rest: Record<Id, Cell>; open: Record<Id, Cell> }> = {
  wide: {
    cols: 4,
    rows: 2,
    rest: { duty: [0, 0, 2, 2], ship: [2, 0, 2, 1], deadline: [2, 1, 1, 1], weather: [3, 1, 1, 1] },
    open: { duty: [0, 0, 4, 2], ship: [2, 0, 2, 2], deadline: [2, 0, 2, 2], weather: [2, 0, 2, 2] },
  },
  narrow: {
    cols: 2,
    rows: 4,
    rest: { duty: [0, 0, 2, 2], ship: [0, 2, 2, 1], deadline: [0, 3, 1, 1], weather: [1, 3, 1, 1] },
    open: { duty: [0, 0, 2, 2], ship: [0, 2, 2, 2], deadline: [0, 2, 2, 2], weather: [0, 2, 2, 2] },
  },
};

const STATUS_DOTS: Record<string, 'clear' | 'watch' | 'hold'> = {
  SG: 'clear', MY: 'clear', ID: 'watch', TH: 'clear', VN: 'clear', PH: 'watch', KH: 'watch', LA: 'watch', MM: 'hold', BN: 'clear',
};
const DOT = { clear: 'bg-success', watch: 'bg-warning', hold: 'bg-destructive' };

const NOTE = 'Illustrative example · figures are not advice';
const LEGEND = [
  { name: 'Duty saved', swatch: 'bg-primary', copy: 'Change the shipment value and watch the saving update.' },
  { name: 'Shipment status', swatch: 'bg-device', copy: 'Four checkpoints from structure to customs.' },
  { name: 'Next deadline', swatch: 'bg-card', copy: 'Renewals and filings coming up.' },
  { name: 'Market weather', swatch: 'bg-tertiary-container', copy: 'Where rules are shifting this quarter.' },
];

const SHIPMENT_SIZES = [25000, 50000, 100000];
const fmt = (n: number) => `A$${Math.round(n).toLocaleString('en-AU')}`;

function useCountTo(target: number, ms = 600) {
  const [v, setV] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return setV(target);
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / ms);
      const e = 1 - Math.pow(1 - k, 3);
      setV(a + (target - a) * e);
      if (k < 1) raf = requestAnimationFrame(tick);
      else from.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

export const Glance = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<'wide' | 'narrow'>('wide');
  const [cell, setCell] = useState(164);
  const [open, setOpen] = useState<Id | null>(null);
  const [size, setSize] = useState(1);
  const gap = 16;

  useLayoutEffect(() => {
    const el = boardRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      const m = w < 560 ? 'narrow' : 'wide';
      const cols = LAYOUT[m].cols;
      setMode(m);
      setCell((w - gap * (cols - 1)) / cols);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const L = LAYOUT[mode];
  const rect = (id: Id) => {
    const [c, r, w, h] = open === id ? L.open[id] : L.rest[id];
    return { left: c * (cell + gap), top: r * (cell + gap), width: w * cell + (w - 1) * gap, height: h * cell + (h - 1) * gap };
  };
  const boardHeight = L.rows * cell + (L.rows - 1) * gap;

  const saved = SHIPMENT_SIZES[size] * 0.1;
  const savedAnim = useCountTo(saved);

  const widget = (id: Id, surface: string, label: string, rest: ReactNode, expanded: ReactNode) => {
    const isOpen = open === id;
    const dim = open !== null && !isOpen;
    return (
      <div
        className={cn(
          'pebble absolute overflow-hidden transition-[left,top,width,height,transform,opacity,border-radius,box-shadow,--lx,--ly] [transition-duration:480ms] [transition-timing-function:cubic-bezier(0.32,0.72,0,1)]',
          surface,
          // Concentric with the board well (44px radius, 16px / 20px padding): 28px mobile, 24px from sm.
          isOpen
            ? 'z-[2] rounded-[14px] sm:rounded-[14px] [box-shadow:var(--edge-top),var(--edge-rim),inset_0_-14px_22px_-16px_hsl(var(--tint)/var(--shade-a)),var(--edge-out),var(--e4)]'
            : 'z-[1] rounded-[14px] sm:rounded-[14px] [box-shadow:var(--edge-top),var(--edge-rim),inset_0_-14px_22px_-16px_hsl(var(--tint)/var(--shade-a)),var(--edge-out),var(--float-drop)]',
          !open && 'hover:-translate-y-1 hover:[box-shadow:var(--edge-top),var(--edge-rim),inset_0_-14px_22px_-16px_hsl(var(--tint)/var(--shade-a)),var(--edge-out),var(--float-drop-hover)]',
          dim && "scale-[0.96] opacity-[0.45]",
        )}
        style={rect(id)}
      >
        <button
          type="button"
          aria-expanded={isOpen}
          aria-label={`${label}: ${isOpen ? 'close' : 'open'}`}
          onClick={() => setOpen(isOpen ? null : id)}
          className="press-strong absolute inset-0 z-0 rounded-[inherit] outline-offset-[-4px]"
        />
        <div className={cn('pointer-events-none absolute inset-0 p-5 transition-opacity', isOpen ? 'opacity-0 [transition-duration:120ms]' : 'opacity-100 [transition-delay:220ms] duration-200')}>{rest}</div>
        <div
          className={cn(
            'absolute inset-0 p-5 transition-opacity [&_a]:pointer-events-auto [&_button]:pointer-events-auto',
            isOpen ? 'pointer-events-none opacity-100 [transition-delay:220ms] duration-200' : 'pointer-events-none opacity-0 [transition-duration:120ms]',
          )}
          aria-hidden={!isOpen}
        >
          {isOpen && expanded}
        </div>
      </div>
    );
  };

  return (
    <section id="glance" className="section band">
      <div className="container">
        <SectionHeading
          eyebrow="Export at a glance"
          title="Your shipment, on one screen."
          subtitle="A sample of the dashboard that comes with a route plan. Tap any widget to open it."
        />

        {/* v3.12: on the grid. The legend is a list in the left 4 columns, the board in the right 8, from 1024px. */}
        <div className="after-heading grid-12 items-start">
        <Reveal className="col-span-4 md:col-span-12 lg:order-2 lg:col-span-8">
            <div className="bezel-well w-full rounded-[12px] p-4 sm:p-5">
              <div ref={boardRef} className="relative" style={{ height: boardHeight }}>
                {widget(
                  'duty',
                  'btn-filled bg-primary text-primary-foreground',
                  'Duty saved',
                  <div className="flex h-full flex-col">
                    <p className="type-mono-sm opacity-70">Duty saved · this shipment</p>
                    <p className="mt-auto font-display text-[44px] font-semibold leading-none tracking-[-0.04em] tabular sm:text-[56px]">{fmt(savedAnim)}</p>
                    <div className="mt-4 flex h-12 items-end gap-2" aria-hidden="true">
                      {[30, 46, 38, 60, 52, 74, 92].map((h, i, arr) => (
                        <span
                          key={i}
                          className={i === arr.length - 1 ? 'w-2 rounded-full bg-primary-foreground/80' : 'w-2 rounded-full bg-primary-foreground/25'}
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>,
                  <div className="flex h-full flex-col">
                    <p className="type-mono-sm opacity-70">Duty saved with an FTA origin claim</p>
                    <p className="mt-2 font-display text-[44px] font-semibold leading-none tracking-[-0.04em] tabular sm:text-[56px]">{fmt(savedAnim)}</p>
                    <div role="radiogroup" aria-label="Shipment value" className="mt-4 inline-flex w-fit rounded-[10px] bg-primary-foreground/10 p-[3px]">
                      {SHIPMENT_SIZES.map((s, i) => (
                        <button
                          key={s}
                          type="button"
                          role="radio"
                          aria-checked={size === i}
                          onClick={() => setSize(i)}
                          className={cn('type-label-md h-[30px] rounded-[7px] px-3.5 transition-colors', size === i ? 'bg-primary-foreground text-primary' : 'text-primary-foreground/80')}
                        >
                          A${s / 1000}k
                        </button>
                      ))}
                    </div>
                    <div className="mt-auto space-y-2">
                      {[
                        ['MFN duty (10%)', 1],
                        ['With FTA (0%)', 0.02],
                      ].map(([l, w]) => (
                        <div key={l as string}>
                          <div className="type-label-sm flex justify-between opacity-80">
                            <span>{l}</span>
                            <span className="tabular">{fmt(SHIPMENT_SIZES[size] * (w === 1 ? 0.1 : 0))}</span>
                          </div>
                          <div className="mt-1 h-2 rounded-full bg-primary-foreground/15">
                            <div className="h-full rounded-full bg-primary-foreground/80 transition-[width] duration-500" style={{ width: `${(w as number) * 100}%` }} />
                          </div>
                        </div>
                      ))}
                      <p className="type-label-sm opacity-60">Illustrative · MY cosmetics route</p>
                    </div>
                  </div>,
                )}

                {widget(
                  'ship',
                  'dark bg-device text-device-foreground [--sheen-a:0.14]',
                  'Shipment status',
                  <div className="flex h-full flex-col">
                    <div className="flex items-center justify-between">
                      <p className="type-mono-sm text-white/60">Shipment · MEL → Port Klang</p>
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-60" />
                        <span className="relative h-2 w-2 rounded-full bg-primary" />
                      </span>
                    </div>
                    <div className="mt-auto flex items-center gap-1.5" aria-hidden="true">
                      {[0, 1, 2, 3].map((i) => (
                        <span key={i} className="flex flex-1 items-center gap-1.5">
                          <span className={cn('h-3 w-3 shrink-0 rounded-full', i < 3 ? 'bg-success' : 'border-2 border-primary')} />
                          {i < 3 && <span className={cn('h-0.5 flex-1 rounded-full', i < 2 ? 'bg-success' : 'bg-white/20')} />}
                        </span>
                      ))}
                    </div>
                    <p className="type-title-md mt-3">3 of 4 checks cleared</p>
                  </div>,
                  <div className="flex h-full flex-col">
                    <p className="type-mono-sm text-white/60">Shipment · MEL → Port Klang</p>
                    <ul className="mt-3 divide-y divide-white/10">
                      {['Structure agreed', 'Contract signed', 'Product registered', 'Customs clearance'].map((s, i) => (
                        <li key={s} className="flex h-11 items-center gap-3">
                          {i < 3 ? (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success text-device">
                              <Check className="h-3 w-3" strokeWidth={3} />
                            </span>
                          ) : (
                            <span className="h-5 w-5 rounded-full border-2 border-primary" />
                          )}
                          <span className="type-label-lg flex-1">{s}</span>
                          <span className={cn('type-label-sm', i < 3 ? 'text-success' : 'text-primary')}>{i < 3 ? 'Done' : 'In progress'}</span>
                        </li>
                      ))}
                    </ul>
                  </div>,
                )}

                {widget(
                  'deadline',
                  'surface-2 text-foreground',
                  'Next deadline',
                  <div className="flex h-full flex-col">
                    <p className="type-mono-sm text-muted-foreground">Next deadline</p>
                    <p className="mt-auto font-display text-[32px] font-semibold leading-none tracking-[-0.04em] tabular min-[400px]:text-[40px]">
                      12<span className="ml-1 font-sans text-[13px] font-semibold tracking-normal text-muted-foreground">days</span>
                    </p>
                    <p className="type-label-sm mt-1.5 text-muted-foreground">TM renewal · MY</p>
                  </div>,
                  <div className="flex h-full flex-col">
                    <p className="type-mono-sm text-muted-foreground">Upcoming</p>
                    <ul className="mt-3 divide-y divide-outline-variant">
                      {[
                        ['12 days', 'Trademark renewal', 'Malaysia'],
                        ['31 days', 'Product notification', 'Malaysia'],
                        ['58 days', 'Distributor review', 'Indonesia'],
                      ].map(([d, t, m]) => (
                        <li key={t} className="flex h-12 items-center gap-3">
                          <Clock3 className="h-4 w-4 text-primary-ink" aria-hidden="true" />
                          <span className="min-w-0 flex-1">
                            <span className="type-label-lg block">{t}</span>
                            <span className="type-label-sm text-muted-foreground">{m}</span>
                          </span>
                          <span className="type-mono-md tabular">{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>,
                )}

                {widget(
                  'weather',
                  'bg-tertiary-container text-tertiary-on-container',
                  'Market weather',
                  <div className="flex h-full flex-col">
                    <div className="-mx-5 -mt-5 h-[56%] overflow-hidden">
                      <MarketScene scene={SCENES.ID} />
                    </div>
                    <p className="type-mono-sm mt-auto opacity-70">Market weather</p>
                    <p className="type-title-sm">ID · Watch</p>
                  </div>,
                  <div className="flex h-full flex-col">
                    <p className="type-mono-sm opacity-70">Market weather · regulatory change watch</p>
                    <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
                      {MARKETS.map((m) => (
                        <li key={m.code} className="type-label-md flex items-center gap-2">
                          <span className={cn('h-2 w-2 rounded-full', DOT[STATUS_DOTS[m.code]])} aria-hidden="true" />
                          {m.name}
                          <span className="sr-only">{STATUS_DOTS[m.code]}</span>
                        </li>
                      ))}
                    </ul>
                    <HashLink to="markets" onClick={() => setOpen(null)} className="type-label-md mt-auto inline-flex items-center gap-1 self-start underline-offset-4 hover:underline">
                      Open markets <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </HashLink>
                  </div>,
                )}
              </div>
            </div>
          </Reveal>
        <Reveal as="ul" stagger className="col-span-4 grid grid-cols-2 gap-x-4 gap-y-5 md:col-span-12 md:grid-cols-4 md:gap-x-6 lg:order-1 lg:col-span-4 lg:grid-cols-1 lg:gap-0 lg:divide-y lg:divide-border lg:border-y lg:border-border">
          {LEGEND.map((l) => (
            <li key={l.name} className="grid grid-cols-[10px_minmax(0,1fr)] content-start items-center gap-x-2.5 lg:py-4">
              <span aria-hidden="true" className={cn('h-2.5 w-2.5 rounded-[3px] shadow-[var(--edge-out)]', l.swatch)} />
              <span className="type-title-sm">{l.name}</span>
              <span className="type-body-sm col-start-2 mt-0.5 text-muted-foreground">{l.copy}</span>
            </li>
          ))}
        </Reveal>
        </div>
        <p className="type-label-sm mt-5 text-muted-foreground lg:text-right">{NOTE}</p>
      </div>
    </section>
  );
};
