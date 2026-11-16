import { useEffect, useRef, useState } from 'react';
import { MarketScene, SCENES } from '@/components/site/MarketScene';
import { SITE } from '@/config/site';
import { cn } from '@/lib/utils';

// Illustrative figures on an A$48,000 shipment; counsel to review before launch.
const PRESETS = [
  { code: 'MY', route: 'MEL → Port Klang', hs: '3304.99', origin: 'AANZFTA · RVC 40%', reg: 'NPRA notified', tm: 'Filed', mfn: '10%', fta: '0%', saved: 'A$4,800', total: 'A$0' },
  { code: 'ID', route: 'MEL → Tanjung Priok', hs: '1905.31', origin: 'AANZFTA · CTH', reg: 'BPOM pending', tm: 'Filed', mfn: '15%', fta: '0%', saved: 'A$7,200', total: 'A$0' },
  { code: 'VN', route: 'MEL → Hai Phong', hs: '6109.10', origin: 'RCEP · CC', reg: 'Not required', tm: 'Pending', mfn: '20%', fta: '8%', saved: 'A$5,760', total: 'A$3,840' },
];

const GLYPHS = '0123456789$,A';
const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

interface ClearancePrinterProps {
  className?: string;
  /** Controlled preset index; falls back to internal state when absent. */
  selected?: number;
  onSelect?: (index: number) => void;
}

/** Hero object: a glossy receipt printer that prints an illustrative clearance receipt per route. */
export const ClearancePrinter = ({ className, selected: selectedProp, onSelect }: ClearancePrinterProps) => {
  const [internal, setInternal] = useState(0);
  const selected = selectedProp ?? internal;
  const [shown, setShown] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'retract' | 'print'>('idle');
  const [printKey, setPrintKey] = useState(0);
  const [led, setLed] = useState(PRESETS[0].saved);
  const timers = useRef<number[]>([]);

  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const scrambleTo = (target: string) => {
    if (reduced()) return setLed(target);
    let t = 0;
    const id = window.setInterval(() => {
      t += 40;
      if (t >= 320) {
        window.clearInterval(id);
        setLed(target);
      } else {
        setLed([...target].map((c) => (c === ' ' ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)])).join(''));
      }
    }, 40);
  };

  // First print once the printer has scaled in (intro base 200ms + 140ms stagger + 700ms entrance).
  useEffect(() => {
    if (reduced()) return;
    later(() => {
      setPhase('print');
      setPrintKey((k) => k + 1);
    }, 1000);
  }, []);

  const choose = (i: number) => {
    if (i === selected) return;
    if (selectedProp === undefined) setInternal(i);
    onSelect?.(i);
  };

  // Run the retract → print sequence whenever the selection changes (device key or external control).
  const prevSelected = useRef(selected);
  useEffect(() => {
    if (prevSelected.current === selected) return;
    prevSelected.current = selected;
    const i = selected;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (reduced()) {
      setShown(i);
      setLed(PRESETS[i].saved);
      return;
    }
    setPhase('retract');
    later(() => {
      setShown(i);
      scrambleTo(PRESETS[i].saved);
      later(() => {
        setPhase('print');
        setPrintKey((k) => k + 1);
      }, 320);
    }, 260);
  }, [selected]);

  const p = PRESETS[shown];
  const printing = phase === 'print';
  const rows: [string, string][] = [
    ['ROUTE', p.route],
    ['HS CODE', p.hs],
    ['ORIGIN RULE', p.origin],
    ['REGISTRATION', p.reg],
    ['TRADEMARK', p.tm],
    ['MFN DUTY', p.mfn],
    ['FTA DUTY', p.fta],
  ];

  return (
    <div className={cn('relative mx-auto h-[400px] w-full max-w-[328px] overflow-hidden rounded-3xl shadow-e4 roomy:h-[460px] roomy:max-w-[400px] roomy:rounded-[36px]', className)}>
      <MarketScene scene={SCENES.home} className="absolute inset-0" />
      {/* Inner rim: the SVG scene covers inset shadows on the root, so the polished edge sits on top. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 rounded-[inherit]"
        style={{ boxShadow: 'inset 0 0 0 1px hsl(0 0% 100% / 0.35), inset 0 1.5px 0.5px hsl(0 0% 100% / 0.6)' }}
      />

      {/* Receipt (behind the head unit, feeding out of the slot) */}
      <div className="absolute inset-x-0 top-[108px] mx-auto w-[232px] roomy:top-[120px] roomy:w-[280px]">
        <div
          className="origin-top"
          style={{
            transform: phase === 'retract' ? 'translateY(-100%)' : undefined,
            transition: 'transform 260ms cubic-bezier(.3,0,.8,.15)',
            animation: phase === 'idle' || reduced() ? undefined : 'receipt-sway 6s ease-in-out 2s infinite alternate',
          }}
        >
          <div
            key={printKey}
            className="receipt-edge relative bg-paper px-3 pb-5 pt-3 roomy:px-4 text-paper-ink shadow-[0_14px_22px_-12px_hsl(160_30%_8%/0.45)]"
            style={{
              backgroundImage: 'linear-gradient(90deg, hsl(0 0% 0% / .05), transparent 12%, transparent 88%, hsl(0 0% 0% / .06))',
              animation: printing ? 'receipt-feed 990ms steps(9,end) both, receipt-settle 240ms cubic-bezier(0.34,1.2,0.64,1) 990ms both' : undefined,
              clipPath: phase === 'idle' && !reduced() ? 'inset(0 0 100% 0)' : undefined,
            }}
          >
            <div className="flex items-baseline justify-between">
              <span className="type-mono-md font-semibold tracking-[0.18em]">~{SITE.name.toUpperCase()}</span>
              <span className="type-mono-sm text-paper-muted">No. 0412</span>
            </div>
            <p className="type-mono-sm mt-0.5 text-paper-muted">Clearance receipt · {p.code}</p>
            <div className="my-2.5 border-t border-dashed border-paper-rule" />
            <dl className="space-y-1">
              {rows.map(([k, v]) => (
                <div key={k} className={cn('justify-between gap-3', k === 'TRADEMARK' ? 'hidden roomy:flex' : 'flex')}>
                  <dt className="type-mono-sm pt-px text-paper-muted">{k}</dt>
                  <dd className="type-mono-md text-right">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="my-2.5 border-t border-dashed border-paper-rule" />
            <div className="flex items-end justify-between">
              <div>
                <p className="type-mono-sm text-paper-muted">Total duty</p>
                <p className="type-mono-sm text-paper-muted">On A$48,000</p>
              </div>
              <p className="font-mono text-[24px] font-semibold leading-none tracking-[-0.02em] tabular">{p.total}</p>
            </div>
            <div className="barcode mx-auto mt-3 hidden h-5 w-[120px] roomy:block" aria-hidden="true" />
            <p className="type-mono-sm mt-2 text-center tracking-normal text-paper-muted roomy:mt-1.5 roomy:tracking-[0.04em]">Illustrative example · not advice</p>
          </div>
        </div>
      </div>

      {/* Head unit */}
      <div
        className="absolute inset-x-0 top-4 z-10 mx-auto w-[272px] roomy:top-5 roomy:w-[340px]"
        style={{ animation: printing && !reduced() ? 'head-nudge 110ms 9 both' : undefined }}
      >
        <div
          className="relative overflow-hidden rounded-[20px] rounded-b-[14px] px-3 pb-3 pt-2"
          style={{
            background: 'linear-gradient(180deg, #1f2924, #0d1411)',
            boxShadow: 'inset 0 1px 0 hsl(0 0% 100% / .18), inset 0 -2px 0 hsl(0 0% 0% / .6), 0 2px 0 #060a08, 0 18px 28px -10px hsl(160 30% 8% / .55)',
          }}
        >
          <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-1/2" style={{ background: 'linear-gradient(180deg, hsl(0 0% 100% / .14), transparent)' }} />
          <div className="relative flex h-6 items-center justify-between">
            <span className="type-mono-sm text-white/70">{SITE.name.toLowerCase()} · print</span>
            <span className="h-[6px] w-[6px] rounded-full bg-[#4ADE80]" style={{ animation: 'led-pulse 2400ms ease-in-out infinite', boxShadow: '0 0 6px #4ADE80' }} aria-hidden="true" />
          </div>
          <div className="relative mt-1 flex items-end justify-between gap-2">
            <div className="flex h-[44px] w-[124px] flex-col justify-center rounded-lg bg-[#060b09] px-2.5 shadow-[inset_0_2px_6px_#000] roomy:w-[148px]">
              <span className="type-mono-sm text-[8px] text-white/40">Duty saved</span>
              <span className="type-led text-led tabular" style={{ textShadow: '0 0 8px hsl(34 100% 55% / .7)' }} aria-live="polite">
                {led}
              </span>
            </div>
            <div role="radiogroup" aria-label="Example route" className="flex gap-1.5">
              {PRESETS.map((pr, i) => {
                const on = i === selected;
                return (
                  <button
                    key={pr.code}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => choose(i)}
                    className="hit type-mono-sm relative h-9 w-[40px] rounded-[10px] text-white/85 transition-[transform,box-shadow] duration-150 roomy:w-[52px]"
                    style={{
                      background: '#2b3631',
                      transform: on ? 'translateY(2px)' : undefined,
                      boxShadow: on ? 'inset 0 1px 0 hsl(0 0% 100% / .1), inset 0 2px 4px #000' : 'inset 0 1px 0 hsl(0 0% 100% / .16), 0 2px 0 #060a08',
                    }}
                  >
                    {on && <span aria-hidden="true" className="absolute left-1/2 top-1 h-1 w-1 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_6px_hsl(var(--primary))]" />}
                    <span className="relative top-0.5">{pr.code}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        {/* Paper slot */}
        <div aria-hidden="true" className="mx-auto -mt-[3px] h-1.5 w-[240px] rounded-[3px] bg-[#030504] roomy:w-[300px]" />
      </div>
    </div>
  );
};
