import { KeyboardEvent, useLayoutEffect, useRef, useState } from 'react';
import { AlertCircle, ArrowRight, ChevronDown, Landmark } from 'lucide-react';
import { MARKETS, MARKETS_REVIEWED } from '@/data/markets';
import { Badge } from '@/components/ui/badge';
import { MarketScene, SCENES } from '@/components/site/MarketScene';
import { SectionHeading } from '@/components/site/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { useEnquiryDraft } from '@/stores/enquiryDraft';
import { cn } from '@/lib/utils';

const CAPITALS: Record<string, string> = {
  SG: 'Singapore',
  MY: 'Kuala Lumpur',
  ID: 'Jakarta',
  TH: 'Bangkok',
  VN: 'Hanoi',
  PH: 'Manila',
  KH: 'Phnom Penh',
  LA: 'Vientiane',
  MM: 'Naypyidaw',
  BN: 'Bandar Seri Begawan',
};
const MARITIME = ['SG', 'MY', 'ID', 'PH', 'BN'];
const MEKONG = ['TH', 'VN', 'KH', 'LA', 'MM'];
const FILTERS = [
  { id: 'all', label: 'All 10', codes: MARKETS.map((m) => m.code) },
  { id: 'maritime', label: 'Maritime', codes: MARITIME },
  { id: 'mekong', label: 'Mekong', codes: MEKONG },
];
const firstSentence = (s: string) => s.split(/(?<=[.;])\s/)[0].replace(/[.;]$/, '');

export const Markets = () => {
  const [filter, setFilter] = useState('all');
  const [activeCode, setActiveCode] = useState('SG');
  const [sheetOpen, setSheetOpen] = useState(true);
  const rows = useRef<Record<string, HTMLButtonElement | null>>({});
  const [surface, setSurface] = useState({ y: 0, h: 64, snap: true });
  const placed = useRef(false);
  const prefill = useEnquiryDraft((s) => s.prefill);

  const list = MARKETS.filter((m) => FILTERS.find((f) => f.id === filter)!.codes.includes(m.code));
  const market = MARKETS.find((m) => m.code === activeCode) ?? list[0];
  const index = MARKETS.findIndex((m) => m.code === market.code);

  useLayoutEffect(() => {
    const el = rows.current[market.code];
    if (!el) return;
    setSurface({ y: el.offsetTop, h: el.offsetHeight, snap: !placed.current });
    placed.current = true;
  }, [market.code, filter]);

  const select = (code: string, focus = false) => {
    setActiveCode(code);
    if (focus) rows.current[code]?.focus();
    rows.current[code]?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = list.findIndex((m) => m.code === market.code);
    const step: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    let next: number | null = null;
    if (e.key in step) next = (i + step[e.key] + list.length) % list.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = list.length - 1;
    if (next === null) return;
    e.preventDefault();
    select(list[next].code, true);
  };

  const askAbout = () => {
    prefill(`I'm interested in exporting to ${market.name}. About my product: `);
    document.getElementById('contact')?.scrollIntoView({ block: 'start' });
    window.setTimeout(() => document.getElementById('enquiry-message')?.focus({ preventScroll: true }), 600);
  };

  return (
    <section id="markets" className="section">
      <div className="container">
        <div className="grid-12">
          <SectionHeading
            className="col-span-4 md:col-span-7"
            eyebrow="Where we work"
            title="Ten markets. Ten rulebooks."
            subtitle="Pick a country to see who regulates it and where exporters usually get stuck."
          />
        </div>

        <Reveal className="after-heading">
          <div className="device-surface dark rounded-[32px] bg-device p-3 text-device-foreground">
            {/* Top row */}
            <div className="flex h-11 items-center justify-between gap-3 px-1">
              <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    aria-pressed={filter === f.id}
                    onClick={() => {
                      setFilter(f.id);
                      if (!f.codes.includes(activeCode)) setActiveCode(f.codes[0]);
                    }}
                    className={cn(
                      'press type-label-md h-[30px] shrink-0 rounded-full px-3 transition-colors',
                      filter === f.id ? 'pebble btn-lift bg-[#F4EEE6] text-[#1F1A16] [--sheen-a:0.7]' : 'bg-white/[0.08] text-white/75 hover:bg-white/[0.12]',
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={askAbout}
                className="pebble btn-lift type-label-md hidden h-[30px] shrink-0 items-center gap-1.5 rounded-full bg-[#F4EEE6] px-3 text-[#1F1A16] [--sheen-a:0.7] sm:inline-flex"
              >
                Ask about {market.name} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-2 grid gap-3 lg:grid-cols-[400px_minmax(0,1fr)]">
              {/* List */}
              <div
                role="tablist"
                aria-label="ASEAN markets"
                aria-orientation="vertical"
                onKeyDown={onKeyDown}
                className="no-scrollbar relative flex gap-1.5 overflow-x-auto lg:max-h-[420px] lg:flex-col lg:gap-0.5 lg:overflow-y-auto lg:overflow-x-visible"
              >
                <span
                  aria-hidden="true"
                  className="pebble absolute inset-x-0 hidden rounded-[14px] bg-white/[0.08] [--sheen-a:0.12] lg:block"
                  style={{
                    top: 0,
                    height: surface.h,
                    transform: `translateY(${surface.y}px)`,
                    boxShadow: 'inset 0 1px 0 hsl(0 0% 100% / .10), inset 0 0 0 1px hsl(0 0% 100% / 0.07), 0 6px 12px -6px #000',
                    transition: surface.snap ? 'none' : 'transform 420ms cubic-bezier(0.34,1.2,0.64,1), height 420ms cubic-bezier(0.34,1.2,0.64,1)',
                  }}
                />
                {list.map((m) => {
                  const on = m.code === market.code;
                  return (
                    <button
                      key={m.code}
                      ref={(el) => (rows.current[m.code] = el)}
                      id={`market-tab-${m.code}`}
                      role="tab"
                      type="button"
                      aria-selected={on}
                      aria-controls="market-panel"
                      tabIndex={on ? 0 : -1}
                      onClick={() => select(m.code)}
                      className={cn(
                        'press group relative z-[1] flex shrink-0 items-center gap-3 rounded-full px-3.5 text-left transition-colors lg:h-16 lg:rounded-[14px] lg:px-4',
                        'h-9 lg:h-16',
                        on ? 'bg-[#F4EEE6] text-[#1F1A16] lg:bg-transparent lg:text-[#F4EEE6]' : 'bg-white/[0.08] text-white/70 hover:text-white lg:bg-transparent',
                      )}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="type-label-md block whitespace-nowrap lg:type-title-md">{m.name}</span>
                        <span className="type-body-sm hidden truncate text-white/55 lg:block">{firstSentence(m.snapshot)}</span>
                      </span>
                      <ArrowRight
                        aria-hidden="true"
                        className={cn('hidden h-4 w-4 shrink-0 transition-[opacity,transform] duration-200 lg:block', on ? 'opacity-100' : '-translate-x-1 opacity-0')}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Scene panel */}
              <div
                id="market-panel"
                role="tabpanel"
                aria-labelledby={`market-tab-${market.code}`}
                className="relative overflow-hidden rounded-[20px] bg-black"
              >
                <div className="relative aspect-[16/11] lg:aspect-auto lg:h-[420px]">
                  <div key={market.code} className="absolute inset-0 animate-in fade-in duration-300">
                    {/* Desktop: lift the scene while the sheet is open so the landmark silhouette stays visible.
                        The wrapper is taller than the panel (132% x 0.76 > 100%) so no gap shows at the bottom. */}
                    <div
                      className={cn(
                        'absolute inset-x-0 top-0 h-full transition-transform [transition-duration:420ms] [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] lg:h-[132%]',
                        sheetOpen && 'lg:-translate-y-[24%]',
                      )}
                    >
                      <MarketScene scene={SCENES[market.code]} />
                    </div>
                  </div>
                  <span className="glass-chip type-mono-md absolute bottom-4 left-4 z-[2] inline-flex h-7 items-center gap-2 rounded-full px-2.5 text-white">
                    <span className="tabular">{String(index + 1).padStart(2, '0')} / 10</span>
                    <span className="text-white/60">·</span>
                    {CAPITALS[market.code]}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSheetOpen((o) => !o)}
                    aria-expanded={sheetOpen}
                    aria-controls="market-sheet"
                    className="glass-chip press absolute right-4 top-4 z-[3] flex h-8 w-8 items-center justify-center rounded-full text-white"
                  >
                    <ChevronDown className={cn('h-4 w-4 transition-transform duration-300', sheetOpen ? 'rotate-0' : 'rotate-180')} aria-hidden="true" />
                    <span className="sr-only">{sheetOpen ? 'Hide details' : 'Show details'}</span>
                  </button>

                  {/* Detail sheet (desktop: over the scene; mobile: below) */}
                  <div
                    id="market-sheet"
                    className={cn(
                      'absolute inset-x-3 bottom-3 z-[2] hidden rounded-[14px] bg-[#F9F5EF] p-5 text-[#1F1A16] shadow-[0_20px_40px_-12px_#000] transition-[transform,opacity] [transition-duration:420ms] [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] lg:block',
                      sheetOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-[110%] opacity-0',
                    )}
                  >
                    <MarketDetail market={market} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 rounded-[18px] bg-[#F9F5EF] p-4 text-[#1F1A16] lg:hidden">
              <MarketDetail market={market} />
            </div>

            <p className="type-body-sm mt-3 px-3 pb-2 pt-1 text-white/50">
              General information only{MARKETS_REVIEWED ? `, as of ${MARKETS_REVIEWED}` : ''}. Rules change often and vary by product. Not legal advice.
              Timor-Leste, ASEAN's newest member: on request.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

const MarketDetail = ({ market }: { market: (typeof MARKETS)[number] }) => (
  <div key={market.code} className="animate-in fade-in duration-300">
    <div className="flex items-start justify-between gap-3">
      <div>
        <h3 className="type-title-lg">{market.name}</h3>
        <p className="type-body-sm mt-1 max-w-[60ch] text-[#5E554C]">{market.snapshot}</p>
      </div>
      {!MARKETS_REVIEWED && (
        <span className="type-label-sm inline-flex h-5 shrink-0 items-center rounded-md bg-[#EDE5DA] px-2 text-[#5E554C]">Draft: under review</span>
      )}
    </div>
    <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_1.4fr_auto]">
      <div>
        <p className="type-eyebrow mb-2 text-[#8A7F73]">Regulators</p>
        <div className="flex flex-wrap gap-1.5">
          {market.regulators.map((r) => (
            <span key={r} className="type-label-sm inline-flex h-6 items-center gap-1 rounded-full bg-white px-2 shadow-[0_0_0_1px_hsl(24_40%_20%/0.08)]">
              <Landmark className="h-3 w-3 text-[#B5410F]" aria-hidden="true" />
              {r}
            </span>
          ))}
        </div>
      </div>
      <div>
        <p className="type-eyebrow mb-2 text-[#8A7F73]">Typical hurdles</p>
        <ul className="grid gap-x-4 gap-y-1 sm:grid-cols-2">
          {market.hurdles.map((h) => (
            <li key={h} className="type-body-sm flex gap-1.5">
              <AlertCircle className="mt-[3px] h-3.5 w-3.5 shrink-0 text-[#B5410F]" aria-hidden="true" />
              {h}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="type-eyebrow mb-2 text-[#8A7F73]">Agreements</p>
        <div className="flex flex-wrap items-start gap-1 sm:flex-col">
          {market.agreements.map((a) => (
            <Badge key={a} variant="tertiary" className="bg-[#D5ECEB] text-[#0F5257]">
              {a}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  </div>
);
