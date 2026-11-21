import { CSSProperties, KeyboardEvent, PointerEvent, useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HashLink } from '@/components/site/HashLink';
import { ClearancePrinter } from '@/components/home/ClearancePrinter';
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

/* ---------- Props (flat illustration with soft shading) ---------- */
const Crates = () => (
  <svg viewBox="0 0 260 250" className="h-full w-full" aria-hidden="true">
    <ellipse cx="130" cy="242" rx="122" ry="8" fill="#000" opacity=".12" />
    {/* bottom crate */}
    <rect x="12" y="128" width="236" height="112" rx="4" fill="#C98F5A" />
    {[150, 176, 202].map((y) => <rect key={y} x="12" y={y} width="236" height="3" fill="#A9733F" />)}
    <path d="M18 134 L242 234 M242 134 L18 234" stroke="#B37C47" strokeWidth="7" />
    <rect x="12" y="128" width="236" height="112" rx="4" fill="none" stroke="#8E5E31" strokeWidth="4" />
    <text x="130" y="196" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="15" fontWeight="600" fill="#5E3B1C" letterSpacing="2">MEL → PKG</text>
    {/* top crate */}
    <rect x="44" y="40" width="172" height="90" rx="4" fill="#D29C68" />
    {[62, 84, 106].map((y) => <rect key={y} x="44" y={y} width="172" height="3" fill="#B07A48" />)}
    <rect x="44" y="40" width="172" height="90" rx="4" fill="none" stroke="#8E5E31" strokeWidth="4" />
    <text x="130" y="94" textAnchor="middle" fontFamily="Sora, sans-serif" fontSize="17" fontWeight="800" fill="#B4300F" letterSpacing="3">FRAGILE</text>
    {/* parcel */}
    <rect x="98" y="4" width="70" height="38" rx="3" fill="#E7C9A0" />
    <rect x="128" y="4" width="10" height="38" fill="#F26A1C" />
    <rect x="98" y="4" width="70" height="38" rx="3" fill="none" stroke="#B8925F" strokeWidth="2.5" />
  </svg>
);

const Container = () => (
  <svg viewBox="0 0 360 290" className="h-full w-full" aria-hidden="true">
    <ellipse cx="180" cy="282" rx="176" ry="8" fill="#000" opacity=".14" />
    <rect x="4" y="10" width="352" height="268" rx="6" fill="#0F4C52" />
    <rect x="4" y="10" width="352" height="18" rx="6" fill="#14606A" />
    {Array.from({ length: 13 }, (_, i) => <rect key={i} x={20 + i * 26} y="34" width="10" height="236" rx="2" fill="#0B3D42" />)}
    <rect x="170" y="30" width="4" height="244" fill="#082F33" />
    {[100, 218].map((x) => <rect key={x} x={x} y="40" width="6" height="226" rx="3" fill="#C9D8D6" opacity=".55" />)}
    <rect x="186" y="46" width="132" height="46" rx="4" fill="#0B3D42" />
    <text x="252" y="67" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="14" fontWeight="600" fill="#F4EEE6" letterSpacing="2">STRT 040412</text>
    <text x="252" y="84" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="10" fill="#A9C9C8" letterSpacing="1.5">22G1 · MAX 30,480 KG</text>
  </svg>
);

const Palm = () => (
  <svg viewBox="0 0 180 300" className="h-full w-full" aria-hidden="true">
    <ellipse cx="90" cy="293" rx="60" ry="6" fill="#000" opacity=".12" />
    <g className="palm-sway" style={{ transformOrigin: '90px 200px' }}>
      <path d="M90 205 C 86 150, 92 110, 96 70" stroke="#3E6B3A" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M96 72 C 60 40, 20 52, 4 86 C 40 70, 70 72, 96 80 Z" fill="#2F6B4F" />
      <path d="M96 72 C 130 36, 168 48, 178 84 C 146 68, 120 72, 96 80 Z" fill="#3E8A64" />
      <path d="M96 74 C 84 30, 104 4, 124 0 C 112 30, 108 52, 98 80 Z" fill="#357A58" />
      <path d="M94 90 C 60 96, 34 126, 30 160 C 52 128, 74 112, 96 100 Z" fill="#3E8A64" />
      <path d="M98 92 C 132 98, 156 128, 160 160 C 138 130, 118 112, 96 102 Z" fill="#2F6B4F" />
    </g>
    <path d="M48 200 H132 L120 292 H60 Z" fill="#C4622D" />
    <rect x="42" y="196" width="96" height="16" rx="4" fill="#D97A43" />
  </svg>
);

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
        <p className="intro type-mono-md flex items-center gap-2 text-[#2A1206]/80" style={step(0)}>
          <span>§ export law for small brands</span>
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#0F4C52]" />
          <span>asean</span>
        </p>
        <h1 className="hero-title mt-2" aria-label="Cleared to sell in Southeast Asia">
          <span aria-hidden="true" className="hero-word inline-block">
            {'Cleared'.split('').map((ch, i) => (
              <span key={i} className="hero-letter inline-block" style={{ '--l': i } as CSSProperties}>{ch}</span>
            ))}
            <span className="hero-dot inline-block" />
          </span>{' '}
          <span aria-hidden="true" className="hero-serif inline-block">to sell.</span>
        </h1>

        <div className="relative z-[3] mt-5 max-w-[34rem] lg:mt-4 lg:max-w-[30rem]">
          <p className="intro hero-lede" style={step(3)}>
            We clear the route before your first shipment leaves: structure, contracts, customs and registration, in ten
            markets, for one fixed fee.
          </p>
          <div className="intro mt-6" style={step(4)}>
            <p className="type-mono-sm text-[#2A1206]/75">try a route →</p>
            <div className="mt-2">
              <RoutePicker value={route} onChange={setRoute} />
            </div>
          </div>
          <div className="intro mt-6 flex flex-wrap gap-3" style={step(5)}>
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
      </div>

      {/* The set: props on the floor, the calculator in front of the title */}
      <div className="hero-set relative z-[1] h-[470px] sm:h-[520px] lg:absolute lg:inset-0 lg:z-[2] lg:h-auto lg:pointer-events-none">
        <div className="prop prop-palm absolute" style={{ '--d': 0.6, '--k': 10 } as CSSProperties}><Palm /></div>
        <div className="prop prop-crates absolute" style={{ '--d': 0.4, '--k': 18 } as CSSProperties}><Crates /></div>
        <div className="prop prop-container absolute" style={{ '--d': 0.8, '--k': 8 } as CSSProperties}><Container /></div>
        <div className="prop prop-calc absolute lg:pointer-events-auto" style={{ '--d': 0.2, '--k': 26 } as CSSProperties}>
          <div className="intro-printer">
            <ClearancePrinter bare className="float-idle" selected={route} onSelect={setRoute} />
          </div>
          <span aria-hidden="true" className="calc-shadow absolute left-1/2" />
        </div>
      </div>

      {/* Floor notes, clock and scroll pill */}
      <div className="hero-notes relative z-[3] lg:absolute lg:inset-x-0 lg:bottom-0">
        <div className="container flex flex-col gap-4 pb-6 pt-5 lg:flex-row lg:items-end lg:justify-between lg:pb-6 lg:pt-0">
          <ul className="space-y-1">
            {NOTES.map((n, i) => (
              <li key={n} className="type-mono-sm flex items-center gap-2 text-[#3B2A1C]">
                <span aria-hidden="true" className="h-1 w-1 shrink-0 rounded-full bg-[#E8590C]" />
                <span className="typed" style={{ '--n': n.length, '--t': i } as CSSProperties}>{n}</span>
              </li>
            ))}
          </ul>
          <span className="scroll-pill type-mono-sm hidden self-center rounded-full bg-[#1F1A16] px-3 py-1.5 text-[#F4EEE6] lg:inline-block" aria-hidden="true">
            scroll ↓
          </span>
          <p className="type-mono-sm text-[#3B2A1C] lg:text-right">
            <span className="tabular" aria-label={`Singapore time ${clock}`}>sgt {clock}</span>
            <span aria-hidden="true" className="mx-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#2FA36B] align-middle" />
            desk open
          </p>
        </div>
      </div>
    </section>
  );
};
