import { CSSProperties, KeyboardEvent, PointerEvent, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { BadgeCheck } from 'lucide-react';
import { SERVICES } from '@/data/services';
import { SERVICE_DETAILS } from '@/data/serviceDetails';
import { cn } from '@/lib/utils';
import { prefersReducedMotion } from '@/lib/reveal';
import '@/styles/services-drawer.css';

/**
 * v5.8 "the file drawer": a sand room with an oak drawer of six manila folders. The active folder stands up out of the
 * drawer and its document lies beside it (paper, stamp, link). The folders are the tabs of one tablist; on phones they
 * turn into a scroll-snap row of tactile pills. Pricing is a ledger slip on the floor.
 */

/* v3.11: how pricing works, said up front. Few advisory sites state it; small exporters ask first. */
const TERMS = [
  { title: 'A fixed fee per job', copy: 'Quoted in writing after the free call, before any work starts.' },
  { title: 'No hourly billing', copy: 'Questions along the way are part of the job, not a new invoice.' },
  { title: 'Local counsel included', copy: 'Where a market needs a licensed local lawyer, we brief them and it is in the quote.' },
];

const SHORT: Record<string, string> = { structure: 'Structure', contracts: 'Contracts', customs: 'Customs', registration: 'Licensing', ip: 'Trademark', disputes: 'Disputes' };
// Dawn palette: orange, teal, sand, cream, ink, orange. `ink` is the label colour on that tab.
const TABS: { bg: string; ink: string }[] = [
  { bg: '#F26A1C', ink: '#2A1206' },
  { bg: '#0F4C52', ink: '#FFF4E6' },
  { bg: '#D9B98A', ink: '#2A1206' },
  { bg: '#FFF4E6', ink: '#2A1206' },
  { bg: '#2A1206', ink: '#FFF4E6' },
  { bg: '#F26A1C', ink: '#2A1206' },
];

const pad = (n: number) => String(n).padStart(2, '0');

const useMedia = (q: string) => {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const on = () => setM(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [q]);
  return m;
};

export const Services = () => {
  const [active, setActive] = useState(0);
  const [seen, setSeen] = useState(false);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const [touched, setTouched] = useState(false);
  const phone = useMedia('(max-width: 639px)');
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const hoverTimer = useRef(0);
  const raf = useRef(0);
  const n = SERVICES.length;

  // Seen once (folders rise in) and "in view" (auto-advance).
  useEffect(() => {
    const el = stage.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setSeen(true);
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        setInView(e.isIntersecting);
        if (e.isIntersecting) setSeen(true);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    const t = window.setTimeout(() => setSeen(true), 2500);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  // Auto-advance: only while in view, not paused/touched, and never with reduced motion.
  useEffect(() => {
    if (prefersReducedMotion() || !inView || paused || touched) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % n), 4000);
    return () => window.clearInterval(id);
  }, [inView, paused, touched, n]);

  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  const pick = (i: number, focus = false) => {
    setTouched(true);
    setActive(i);
    if (focus) tabs.current[i]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    let next: number | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (active + 1) % n;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (active - 1 + n) % n;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = n - 1;
    if (next === null) return;
    e.preventDefault();
    pick(next, true);
  };

  // Keep the active pill in view in the phone row (scroll the row only, never the page).
  useEffect(() => {
    if (!phone) return;
    const b = tabs.current[active];
    const row = b?.parentElement;
    if (b && row) row.scrollTo({ left: b.offsetLeft - (row.clientWidth - b.clientWidth) / 2, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }, [active, phone]);

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse' || prefersReducedMotion() || !root.current) return;
    const r = root.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      root.current?.style.setProperty('--px', x.toFixed(3));
      root.current?.style.setProperty('--py', y.toFixed(3));
    });
  };

  return (
    <section id="services" ref={root} onPointerMove={onPointerMove} aria-labelledby="services-title" className="sv">
      <div aria-hidden="true" className="sv-wall" />
      <div aria-hidden="true" className="sv-light" />

      <div className="container relative z-[2] pt-10 md:pt-14 lg:pt-16">
        {/* Marker row */}
        <div className="sv-mono flex flex-wrap items-center justify-between gap-x-6 gap-y-1 text-[#2A1206]/75">
          <p>§ 02 what we do</p>
          <p>06 fixed-fee jobs</p>
        </div>
        <h2 id="services-title" className="section-title mt-5 max-w-[18ch]">
          Six jobs we take off your desk.
        </h2>
        <p className="mt-3 max-w-[46ch] text-[16px] leading-[24px] text-[#2A1206]/75 md:text-[18px] md:leading-[28px]">Hire us for one, or for the whole route from structure to first shipment.</p>

        {/* Stage */}
        <div ref={stage} data-in={seen} className="sv-stage" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
          <span aria-hidden="true" className="sv-word">
            SIX JOBS.
          </span>
          <div className="sv-drawer-col">
            <div className="sv-drawer">
              <div aria-hidden="true" className="sv-back" />
              <div aria-hidden="true" className="sv-rail" data-side="l" />
              <div aria-hidden="true" className="sv-rail" data-side="r" />
              <div aria-hidden="true" className="sv-shadow" />
              <div role="tablist" aria-label="Services" aria-orientation="horizontal" onKeyDown={onKeyDown} className="sv-folders">
                {SERVICES.map((s, i) => {
                  const on = i === active;
                  const c = TABS[i];
                  const common = {
                    ref: (el: HTMLButtonElement | null) => {
                      tabs.current[i] = el;
                    },
                    id: `sv-tab-${s.id}`,
                    type: 'button' as const,
                    role: 'tab' as const,
                    'aria-selected': on,
                    'aria-controls': `sv-panel-${s.id}`,
                    'aria-label': s.title,
                    tabIndex: on ? 0 : -1,
                    onClick: () => pick(i),
                  };
                  if (phone)
                    return (
                      <button
                        key={s.id}
                        {...common}
                        className={cn('btn-lift hit type-label-md h-10 shrink-0 snap-start whitespace-nowrap rounded-full px-4', on ? 'btn-filled bg-primary text-primary-foreground' : 'btn-raised bg-paper text-paper-ink')}
                      >
                        {SHORT[s.id]}
                      </button>
                    );
                  return (
                    <button
                      key={s.id}
                      {...common}
                      onPointerEnter={(e) => {
                        if (e.pointerType !== 'mouse') return;
                        window.clearTimeout(hoverTimer.current);
                        hoverTimer.current = window.setTimeout(() => pick(i), 140);
                      }}
                      onPointerLeave={() => window.clearTimeout(hoverTimer.current)}
                      className="sv-folder"
                      style={{ '--i': i, '--tab': c.bg, '--tab-ink': c.ink } as CSSProperties}
                    >
                      <span aria-hidden="true" className="sv-folder-sheet" />
                      <span aria-hidden="true" className="sv-folder-tab">
                        {SHORT[s.id]}
                      </span>
                      <span aria-hidden="true" className="sv-folder-body" />
                    </button>
                  );
                })}
              </div>
              <div aria-hidden="true" className="sv-front">
                <span className="sv-label">Files 01 to 06</span>
                <span className="sv-handle" />
              </div>
            </div>
          </div>

          <div className="sv-paper-col">
            <div className="sv-paper-wrap">
              <div className="sv-paper-grid receipt-edge" style={{ ['--s' as string]: '7px' }}>
                {SERVICES.map((s, i) => {
                  const on = i === active;
                  const d = SERVICE_DETAILS[s.id];
                  return (
                    <div
                      key={s.id}
                      id={`sv-panel-${s.id}`}
                      role="tabpanel"
                      aria-labelledby={`sv-tab-${s.id}`}
                      data-on={on}
                      aria-hidden={on ? undefined : true}
                      className="sv-sheet"
                      style={{ '--tab': TABS[i].bg } as CSSProperties}
                    >
                      <p className="sv-head">
                        <span>
                          File {pad(i + 1)} / {pad(n)} · {SHORT[s.id]}
                        </span>
                      </p>
                      <h3 className="sv-title">{s.title}</h3>
                      <p className="sv-copy">{s.copy}</p>
                      <p className="sv-stamp">You get: {s.deliverable}</p>
                      {d && (
                        <dl className="sv-time">
                          <dt>Timeline</dt>
                          <dd>{d.timeline}</dd>
                        </dl>
                      )}
                      <div className="sv-foot">
                        {d && (
                          <Link to={`/services/${d.slug}`} tabIndex={on ? 0 : -1} className="btn-raised btn-lift hit type-label-lg box-border inline-flex h-11 min-h-11 items-center gap-2 rounded-full bg-paper px-5 text-paper-ink">
                            Read the full service <span aria-hidden="true">→</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The floor, with the pricing ledger lying on it */}
      <div className="sv-floor pb-12 pt-[72px] md:pb-16 md:pt-[84px]">
        <div className="container">
          <div className="sv-slip-wrap">
            <div className="sv-slip receipt-edge" style={{ ['--s' as string]: '6px' }}>
              <div className="sv-slip-head">
                <h3 className="contents">
                  <span>How pricing works</span>
                </h3>
                <span>One quote, agreed before work starts</span>
              </div>
              <ul className="sv-slip-rows">
                {TERMS.map((t) => (
                  <li key={t.title}>
                    <BadgeCheck className="mt-px h-5 w-5 text-paper-teal-ink" strokeWidth={2} aria-hidden="true" />
                    <h4 className="type-title-sm text-paper-ink">{t.title}</h4>
                    <p className="type-body-sm col-start-2 mt-1 text-paper-muted">{t.copy}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
