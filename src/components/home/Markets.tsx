import { KeyboardEvent, useRef, useState } from 'react';
import { MARKETS, MARKETS_REVIEWED } from '@/data/markets';
import { SectionLabel } from '@/components/site/SectionLabel';
import { ScrambleText } from '@/components/motion/ScrambleText';
import { Reveal } from '@/components/motion/Reveal';
import { cn } from '@/lib/utils';

const Field = ({ id, label, children }: { id: string; label: string; children: React.ReactNode }) => (
  <div className="border-t border-dashed border-rule pt-4">
    <div className="label-mono mb-2 text-muted-foreground">
      <span className="text-accent">{id}</span> / {label}
    </div>
    {children}
  </div>
);

export const Markets = () => {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const market = MARKETS[active];

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    let next: number | null = null;
    if (e.key in keys) next = (active + keys[e.key] + MARKETS.length) % MARKETS.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = MARKETS.length - 1;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
    tabs.current[next]?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  };

  return (
    <section id="markets" className="scroll-mt-20 border-y border-border bg-card/50 py-20 md:py-28">
      <div className="container">
        <SectionLabel index="03" label="WHERE WE WORK" />
        <Reveal>
          <h2 className="text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
            Ten markets. Ten <em className="font-medium text-accent">rulebooks</em>.
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Pick a country to see what usually stands between your product and the shelf.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:gap-10">
          <div
            role="tablist"
            aria-label="ASEAN markets"
            onKeyDown={onKeyDown}
            className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:col-span-4 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0 lg:pb-0"
          >
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
                  onClick={() => setActive(i)}
                  className={cn(
                    'group flex shrink-0 items-center gap-3 border px-3 py-2 text-left font-mono text-sm transition-colors lg:border-x-0 lg:border-t-0 lg:px-2 lg:py-3',
                    selected
                      ? 'border-primary bg-primary text-primary-foreground lg:border-border'
                      : 'border-border bg-background hover:border-primary lg:bg-transparent',
                  )}
                >
                  <span className={cn('font-medium', selected ? '' : 'text-accent')}>{m.code}</span>
                  <span className="whitespace-nowrap">{m.name}</span>
                  <span aria-hidden="true" className="ml-auto hidden lg:inline">
                    {selected ? '<-' : ''}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            id="market-panel"
            role="tabpanel"
            aria-labelledby={`market-tab-${market.code}`}
            className="relative border border-border bg-background p-6 md:p-8 lg:col-span-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="label-mono text-muted-foreground">Manifest · Destination</div>
                <div className="mt-2 flex items-baseline gap-4">
                  <span className="font-mono text-5xl font-medium text-accent md:text-6xl">
                    <ScrambleText text={market.code} replayKey={market.code} />
                  </span>
                  <h3 className="text-2xl font-semibold md:text-3xl">{market.name}</h3>
                </div>
              </div>
              <pre aria-hidden="true" className="hidden select-none font-mono text-xs leading-tight text-ascii sm:block">
                {` _______\n|  ___  |\n| |___| |\n|_______|`}
              </pre>
            </div>

            <div key={market.code} className="mt-8 grid gap-6 duration-200 animate-in fade-in md:grid-cols-2">
              <div className="md:col-span-2">
                <Field id="A" label="Snapshot">
                  <p className="text-lg leading-snug">{market.snapshot}</p>
                </Field>
              </div>
              <Field id="B" label="Regulators">
                <ul className="space-y-1">
                  {market.regulators.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </Field>
              <Field id="C" label="Typical hurdles">
                <ul className="space-y-1">
                  {market.hurdles.map((h) => (
                    <li key={h} className="flex gap-2">
                      <span aria-hidden="true" className="font-mono text-accent">
                        -
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              </Field>
              <div className="md:col-span-2">
                <Field id="D" label="Agreements in force">
                  <div className="flex flex-wrap gap-2">
                    {market.agreements.map((a) => (
                      <span key={a} className="border border-primary/40 px-2 py-0.5 font-mono text-sm text-primary">
                        {a}
                      </span>
                    ))}
                  </div>
                </Field>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 max-w-3xl font-mono text-xs leading-relaxed text-muted-foreground">
          General information only{MARKETS_REVIEWED ? `, as of ${MARKETS_REVIEWED}` : ''}. Rules change often and vary
          by product. Not legal advice. Timor-Leste, ASEAN's newest member: on request.
          {!MARKETS_REVIEWED && (
            <span className="ml-2 border border-accent px-1 text-accent">DRAFT · REVIEW BEFORE LAUNCH</span>
          )}
        </p>
      </div>
    </section>
  );
};
