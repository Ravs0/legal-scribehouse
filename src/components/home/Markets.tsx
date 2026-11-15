import { KeyboardEvent, useLayoutEffect, useRef, useState } from 'react';
import { AlertCircle, ArrowRight, Landmark } from 'lucide-react';
import { MARKETS, MARKETS_REVIEWED } from '@/data/markets';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AssistChip } from '@/components/ui/chip';
import { SectionHeading } from '@/components/site/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { spawnRipple } from '@/hooks/useRipple';
import { useEnquiryDraft } from '@/stores/enquiryDraft';
import { cn } from '@/lib/utils';

const RowLabel = ({ children }: { children: string }) => (
  <h4 className="type-eyebrow mb-3 text-muted-foreground">{children}</h4>
);

export const Markets = () => {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const prefill = useEnquiryDraft((s) => s.prefill);
  const market = MARKETS[active];

  // Sliding indicator follows the active tab.
  useLayoutEffect(() => {
    const update = () => {
      const el = tabs.current[active];
      if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    };
    update();
    window.addEventListener('resize', update);
    document.fonts?.ready.then(update);
    return () => window.removeEventListener('resize', update);
  }, [active]);

  const select = (i: number, focus = false) => {
    setActive(i);
    const el = tabs.current[i];
    if (focus) el?.focus();
    el?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let next: number | null = null;
    if (e.key in step) next = (active + step[e.key] + MARKETS.length) % MARKETS.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = MARKETS.length - 1;
    if (next === null) return;
    e.preventDefault();
    select(next, true);
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
            subtitle="Pick a country to see who regulates it, what usually goes wrong, and which trade agreements cut your duty."
          />
        </div>

        <Reveal className="after-heading">
          <div className="-mx-4 overflow-x-auto px-4 no-scrollbar sm:-mx-6 sm:px-6 md:mx-0 md:px-0">
            <div
              role="tablist"
              aria-label="ASEAN markets"
              onKeyDown={onKeyDown}
              className="liquid relative inline-flex h-[52px] min-w-full snap-x snap-proximity items-center rounded-full p-1 md:flex"
            >
              <span
                aria-hidden="true"
                className="spring-pill absolute bottom-1 top-1 rounded-full bg-primary-container"
                style={{ width: indicator.width, transform: `translateX(${indicator.left - 4}px)`, left: 4 }}
              />
              {MARKETS.map((m, i) => {
                const selected = i === active;
                return (
                  <button
                    key={m.code}
                    ref={(el) => (tabs.current[i] = el)}
                    id={`market-tab-${m.code}`}
                    role="tab"
                    type="button"
                    aria-selected={selected}
                    aria-controls="market-panel"
                    tabIndex={selected ? 0 : -1}
                    onClick={() => select(i)}
                    onPointerDown={(e) => spawnRipple(e.currentTarget, e.clientX, e.clientY)}
                    className={cn(
                      'state-layer press-spring type-label-lg relative h-11 shrink-0 snap-start overflow-hidden whitespace-nowrap rounded-full px-4 md:flex-1',
                      selected ? 'text-primary-on-container' : 'text-muted-foreground',
                    )}
                  >
                    {m.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div
            id="market-panel"
            role="tabpanel"
            aria-labelledby={`market-tab-${market.code}`}
            className="glass liquid-sheen panel-pad mt-6 rounded-xl"
          >
            <div key={market.code} className="grid-12 animate-panel-in gap-y-8">
              <div className="col-span-4 md:col-span-5">
                <div className="flex items-center gap-4">
                  <span className="pebble type-title-lg flex h-14 w-14 shrink-0 items-center justify-center bg-tertiary-container text-tertiary-on-container">
                    {market.code}
                  </span>
                  <h3 className="type-headline-md">{market.name}</h3>
                </div>
                <p className="type-body-lg mt-6 text-foreground">{market.snapshot}</p>
              </div>

              <div className="col-span-4 divide-y divide-outline-variant md:col-span-7">
                <div className="pb-6">
                  <RowLabel>Regulators</RowLabel>
                  <div className="flex flex-wrap gap-2">
                    {market.regulators.map((r) => (
                      <AssistChip key={r} icon={Landmark}>
                        {r}
                      </AssistChip>
                    ))}
                  </div>
                </div>
                <div className="py-6">
                  <RowLabel>Typical hurdles</RowLabel>
                  <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                    {market.hurdles.map((h) => (
                      <li key={h} className="type-body-md flex gap-2">
                        <AlertCircle className="mt-1 h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-6">
                  <RowLabel>Agreements in force</RowLabel>
                  <div className="flex flex-wrap gap-2">
                    {market.agreements.map((a) => (
                      <Badge key={a} variant="tertiary">
                        {a}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col-reverse items-start gap-3 border-t border-outline-variant pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="type-body-sm max-w-[64ch] text-muted-foreground">
                General information only{MARKETS_REVIEWED ? `, as of ${MARKETS_REVIEWED}` : ''}. Rules change often and
                vary by product. Not legal advice. Timor-Leste, ASEAN's newest member: on request.{' '}
                {!MARKETS_REVIEWED && (
                  <Badge variant="secondary" className="ml-1 align-middle">
                    Draft: under review
                  </Badge>
                )}
              </p>
              <Button variant="ghost" icon="trailing" onClick={askAbout} className="-ml-3 sm:ml-0">
                Ask about {market.name} <ArrowRight aria-hidden="true" />
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
