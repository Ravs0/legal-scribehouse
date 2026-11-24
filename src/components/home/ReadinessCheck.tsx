import { useId, useMemo, useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/site/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { MAX_SCORE, READINESS_QUESTIONS, verdictFor } from '@/data/readiness';
import { useEnquiryDraft } from '@/stores/enquiryDraft';
import { cn } from '@/lib/utils';

const STATUS = {
  HOLD: { label: 'Hold', color: 'hsl(var(--destructive))' },
  INSPECT: { label: 'Inspect', color: 'hsl(var(--warning))' },
  CLEARED: { label: 'Cleared', color: 'hsl(var(--success))' },
} as const;

const LEGEND: { stamp: keyof typeof STATUS; range: string; copy: string }[] = [
  { stamp: 'HOLD', range: '0–4', copy: 'Fundamentals missing. Fix before you ship.' },
  { stamp: 'INSPECT', range: '6–8', copy: 'Basics in place. Close the gaps.' },
  { stamp: 'CLEARED', range: '10–12', copy: 'Ready. A quick review, then go.' },
];

/** iOS-style switch: the visible track is 44×26 (thumb 20, 18px travel on a spring); the button around it is 44×44 so
 *  the whole hit area meets the touch minimum without changing the look. */
const Toggle = ({ checked, onChange, labelledBy, describedBy }: { checked: boolean; onChange: (v: boolean) => void; labelledBy: string; describedBy: string }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-labelledby={labelledBy}
    aria-describedby={describedBy}
    onClick={(e) => {
      e.stopPropagation();
      onChange(!checked);
    }}
    className="press-soft group relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
  >
    <span
      aria-hidden="true"
      className="block h-[26px] w-11 rounded-full p-[3px] transition-[background-color] duration-200"
      style={{
        background: checked ? 'hsl(var(--success))' : 'hsl(var(--input) / 0.42)',
        backgroundImage: 'linear-gradient(to bottom, hsl(0 0% 0% / .10), transparent 60%)',
        boxShadow: 'inset 0 1px 2px hsl(0 0% 0% / .16), inset 0 0 0 1px hsl(0 0% 0% / .06), inset 0 -1px 0 hsl(0 0% 100% / .35)',
      }}
    >
      <span
        className="pebble-thumb block h-5 w-5 rounded-full transition-[transform,width] [transition-duration:220ms] [transition-timing-function:cubic-bezier(0.34,1.2,0.64,1)] group-active:w-6"
        style={{ transform: `translateX(${checked ? 18 : 0}px)` }}
      />
    </span>
  </button>
);

/** The crate artwork. Drawn twice with different crops (wide strip below 1024, near-4:3 well above); each copy owns its
 *  gradient id so the hidden copy never breaks the visible one's fill. */
const CrateArt = ({ tag, viewBox, className }: { tag: string; viewBox: string; className?: string }) => {
  const shade = `crate-shade-${useId().replace(/:/g, '')}`;
  return (
    <svg aria-hidden="true" viewBox={viewBox} className={cn('absolute inset-0 h-full w-full', className)}>
      <ellipse cx="208" cy="142" rx="96" ry="12" fill="#000" opacity="0.12" />
      {/* pallet */}
      <rect x="134" y="124" width="148" height="10" rx="2" fill="#B98A5E" />
      <rect x="140" y="134" width="14" height="8" fill="#9C7149" />
      <rect x="201" y="134" width="14" height="8" fill="#9C7149" />
      <rect x="262" y="134" width="14" height="8" fill="#9C7149" />
      {/* crate */}
      <rect x="146" y="50" width="124" height="74" rx="4" fill="#E2B27F" />
      <rect x="146" y="50" width="124" height="74" rx="4" fill={`url(#${shade})`} />
      {[66, 84, 102].map((y) => (
        <rect key={y} x="146" y={y} width="124" height="2" fill="#C99561" />
      ))}
      <path d="M150 54 L266 120 M266 54 L150 120" stroke="#C99561" strokeWidth="4" />
      <rect x="146" y="50" width="124" height="74" rx="4" fill="none" stroke="#B07E4D" strokeWidth="3" />
      {/* tag + string */}
      <path d="M262 62 Q292 54 300 76" stroke="#6B5844" strokeWidth="1.5" fill="none" />
      <g style={{ transition: 'fill 220ms' }}>
        <rect x="288" y="74" width="44" height="26" rx="5" fill={tag} style={{ transition: 'fill 220ms cubic-bezier(0.2,0,0,1)' }} />
        <circle cx="295" cy="87" r="3" fill="#fff" opacity="0.8" />
      </g>
      <defs>
        <linearGradient id={shade} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="1" stopColor="#000" stopOpacity="0.08" />
        </linearGradient>
      </defs>
    </svg>
  );
};

/** Header illustration: a crate on a pallet with a clearance tag in the verdict colour. 168px strip below 1024; a 4:3
 *  well filling the left column above, cropped around the crate so it reads larger. */
const CrateScene = ({ tag, score }: { tag: string; score: number }) => (
  <div className="relative h-[168px] overflow-hidden rounded-[10px] bg-tertiary-container shadow-[inset_0_0_0_1px_hsl(var(--tertiary)/0.12)] sm:h-[200px] lg:aspect-[10/7] lg:h-auto">
    <CrateArt tag={tag} viewBox="0 0 416 168" className="lg:hidden" />
    <CrateArt tag={tag} viewBox="82 4 280 196" className="hidden lg:block" />
    <span className="type-mono-md tabular absolute right-3 top-3 inline-flex h-7 items-center rounded-full bg-white/85 px-3 text-paper-ink shadow-e1">
      {score} / {MAX_SCORE}
    </span>
  </div>
);

export const ReadinessCheck = () => {
  const [on, setOn] = useState<boolean[]>(() => READINESS_QUESTIONS.map(() => false));
  const prefill = useEnquiryDraft((s) => s.prefill);
  const score = on.filter(Boolean).length * 2;
  const verdict = verdictFor(score);
  const status = STATUS[verdict.stamp];
  const gaps = useMemo(() => READINESS_QUESTIONS.filter((_, i) => !on[i]), [on]);

  const sendResult = () => {
    const lines = [
      `I took the export readiness check and scored ${score}/${MAX_SCORE} (${status.label}).`,
      ...(gaps.length ? ['Still to do:', ...gaps.slice(0, 3).map((g) => `- ${g.fix}`)] : []),
      '',
      'About my product and target market: ',
    ];
    prefill(lines.join('\n'));
    document.getElementById('contact')?.scrollIntoView({ block: 'start' });
    window.setTimeout(() => document.getElementById('enquiry-message')?.focus({ preventScroll: true }), 600);
  };

  return (
    <section id="readiness" className="section">
      <div className="container">
        <SectionHeading
          index="06"
          eyebrow="Readiness check"
          title="Is your product ready to ship?"
          subtitle="Flip six switches and see where you stand before the goods leave."
        >
          {/* v3.9: the reassurances are one centred row under the subtitle (wraps on phones). */}
          <ul className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
            {['Takes under a minute', 'No email needed', 'Your answers stay in your browser'].map((t) => (
              <li key={t} className="type-body-sm flex items-center gap-2 text-muted-foreground">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                  <Check className="h-2.5 w-2.5" strokeWidth={3} aria-hidden="true" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </SectionHeading>

        {/* v3.9: one centred panel. ≥1024 it splits 5/12 (illustration, verdict, legend, actions pinned to the bottom)
            and 7/12 (the six switches, spread to the column height); both columns share the bottom edge. Below 1024
            the column wrappers become display:contents and `order-*` restores the phone order:
            illustration, title, switches, fix-first, legend, actions. */}
        <Reveal className="after-heading">
          <div className="surface-3 flex w-full flex-col rounded-[14px] p-3 md:p-4 lg:grid lg:grid-cols-12 lg:gap-8 lg:p-5">
            <div className="contents lg:col-span-5 lg:flex lg:flex-col">
              <div className="order-1 lg:order-none">
                <CrateScene tag={status.color} score={score} />
              </div>

              <div className="order-2 pt-4 lg:order-none">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="type-headline-sm">Export readiness</h3>
                  <span
                    className="type-label-sm inline-flex h-5 items-center rounded-md px-2 transition-colors duration-200"
                    style={{ color: `color-mix(in srgb, ${status.color} 72%, hsl(var(--foreground)))`, background: `color-mix(in srgb, ${status.color} 14%, transparent)` }}
                    aria-live="polite"
                  >
                    {status.label}
                  </span>
                </div>
                <p className="type-body-sm mt-0.5 text-muted-foreground">Flip on what's already done.</p>
                <div className="mt-3 grid grid-cols-6 gap-1" aria-hidden="true">
                  {READINESS_QUESTIONS.map((q, i) => (
                    <span
                      key={q.id}
                      className="h-1.5 rounded-full bg-foreground/10 transition-colors duration-300"
                      style={on[i] ? { background: status.color } : undefined}
                    />
                  ))}
                </div>
              </div>

              <p className="type-body-sm order-4 mt-4 flex min-h-[60px] items-center rounded-[10px] bg-surface-container-low px-3.5 py-2.5 text-muted-foreground shadow-[inset_0_0_0_1px_hsl(var(--outline-variant)/0.7)] lg:order-none">
                <span>
                  {gaps.length ? (
                    <>
                      <span className="font-semibold text-foreground">Fix first:</span> {gaps[0].fix}.
                    </>
                  ) : (
                    <>
                      <span className="font-semibold text-foreground">{verdict.title}</span> {verdict.copy}
                    </>
                  )}
                </span>
              </p>

              {/* The score legend (was the separate "How to read your score" card). */}
              <div className="order-5 mt-4 border-t border-outline-variant pt-4 lg:order-none">
                <p className="sr-only">How to read your score</p>
                <ul className="space-y-2.5">
                  {LEGEND.map((l) => (
                    <li key={l.stamp} className="flex items-start gap-2.5">
                      <span
                        className="type-label-sm inline-flex h-5 w-16 shrink-0 items-center justify-center rounded-md"
                        style={{ color: `color-mix(in srgb, ${STATUS[l.stamp].color} 72%, hsl(var(--foreground)))`, background: `color-mix(in srgb, ${STATUS[l.stamp].color} 14%, transparent)` }}
                      >
                        {STATUS[l.stamp].label}
                      </span>
                      <span className="type-mono-md tabular w-12 shrink-0 leading-5">{l.range}</span>
                      <span className="type-body-sm min-w-0 leading-5 text-muted-foreground [text-wrap:pretty]">{l.copy}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="order-6 pb-2 pt-5 lg:order-none lg:mt-auto lg:pb-0">
                {/* One column below 380px so "Book a free call" never spills out of its pill. */}
                <div className="grid grid-cols-1 gap-2 min-[380px]:grid-cols-2">
                  <Button onClick={sendResult}>
                    Book a free call <ArrowRight aria-hidden="true" />
                  </Button>
                  <Button variant="outline" onClick={() => setOn(READINESS_QUESTIONS.map(() => true))}>
                    Mark all done
                  </Button>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setOn(READINESS_QUESTIONS.map(() => false))}
                    className="btn-raised btn-lift type-label-md relative h-10 shrink-0 rounded-full bg-card px-4 [@media(pointer:coarse)]:h-11 text-foreground"
                  >
                    Reset
                  </button>
                  <span className="type-label-sm text-right text-muted-foreground">Indicative only · not legal advice</span>
                </div>
              </div>
            </div>

            <div className="contents lg:col-span-7 lg:flex lg:flex-col">
              <ul className="order-3 mt-4 divide-y divide-outline-variant lg:order-none lg:mt-0 lg:flex lg:flex-1 lg:flex-col lg:px-0">
                {READINESS_QUESTIONS.map((q, i) => (
                  <li
                    key={q.id}
                    onClick={() => setOn((prev) => prev.map((x, j) => (j === i ? !x : x)))}
                    className="group/row flex min-h-14 cursor-pointer items-center gap-3 py-2 transition-colors lg:min-h-16 lg:flex-1 lg:gap-4 lg:px-5 lg:hover:bg-foreground/[0.03] lg:first:rounded-t-[10px] lg:last:rounded-b-[10px]"
                  >
                    <span aria-hidden="true" className="type-mono-md tabular hidden w-6 shrink-0 text-muted-foreground sm:block">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p id={`rq-${q.id}`} className="type-title-sm">
                        {q.label}
                      </p>
                      <p id={`rq-${q.id}-d`} className="type-body-sm text-muted-foreground">
                        {q.sublabel}
                      </p>
                    </div>
                    <Toggle
                      checked={on[i]}
                      onChange={(v) => setOn((prev) => prev.map((x, j) => (j === i ? v : x)))}
                      labelledBy={`rq-${q.id}`}
                      describedBy={`rq-${q.id}-d`}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
