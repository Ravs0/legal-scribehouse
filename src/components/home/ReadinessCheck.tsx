import { useMemo, useState } from 'react';
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

/** iOS-style switch: track 44×26, thumb 20, 18px travel on a spring. */
const Toggle = ({ checked, onChange, labelledBy, describedBy }: { checked: boolean; onChange: (v: boolean) => void; labelledBy: string; describedBy: string }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-labelledby={labelledBy}
    aria-describedby={describedBy}
    onClick={() => onChange(!checked)}
    className="group relative h-[26px] w-11 shrink-0 rounded-full p-[3px] transition-colors duration-200"
    style={{
      background: checked ? 'hsl(var(--success))' : 'hsl(var(--input) / 0.3)',
      backgroundImage: 'linear-gradient(to bottom, hsl(0 0% 0% / .10), transparent 60%)',
      boxShadow: 'inset 0 1px 2px hsl(0 0% 0% / .16), inset 0 -1px 0 hsl(0 0% 100% / .35)',
    }}
  >
    <span
      aria-hidden="true"
      className="pebble-thumb block h-5 w-5 rounded-full transition-[transform,width] [transition-duration:220ms] [transition-timing-function:cubic-bezier(0.34,1.2,0.64,1)] group-active:w-6"
      style={{
        transform: `translateX(${checked ? 18 : 0}px)`,
      }}
    />
  </button>
);

/** Header illustration: a crate on a pallet with a clearance tag in the verdict colour. */
const CrateScene = ({ tag, score }: { tag: string; score: number }) => (
  <div className="relative h-[168px] overflow-hidden rounded-[18px] bg-[#CFEBDD] dark:bg-[#17352E]">
    <svg aria-hidden="true" viewBox="0 0 416 168" className="absolute inset-0 h-full w-full">
      <ellipse cx="208" cy="142" rx="96" ry="12" fill="#000" opacity="0.12" />
      {/* pallet */}
      <rect x="134" y="124" width="148" height="10" rx="2" fill="#B98A5E" />
      <rect x="140" y="134" width="14" height="8" fill="#9C7149" />
      <rect x="201" y="134" width="14" height="8" fill="#9C7149" />
      <rect x="262" y="134" width="14" height="8" fill="#9C7149" />
      {/* crate */}
      <rect x="146" y="50" width="124" height="74" rx="4" fill="#E2B27F" />
      <rect x="146" y="50" width="124" height="74" rx="4" fill="url(#crate-shade)" />
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
        <linearGradient id="crate-shade" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="1" stopColor="#000" stopOpacity="0.08" />
        </linearGradient>
      </defs>
    </svg>
    <span className="type-mono-md tabular absolute right-3 top-3 inline-flex h-7 items-center rounded-full bg-white/80 px-2.5 text-[#1F1A16] shadow-e1">
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
        <div className="grid-12 items-center gap-y-8">
          <div className="col-span-4 md:col-span-12 lg:col-span-6">
            <SectionHeading
              eyebrow="Readiness check"
              title="Is your product ready to ship?"
              subtitle="Six switches. Twelve points. One honest answer."
            >
              <ul className="mt-6 space-y-2.5">
                {['Takes under a minute', 'No email needed', 'Your answers stay in your browser'].map((t) => (
                  <li key={t} className="type-body-md flex items-center gap-2.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success/15 text-success">
                      <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </SectionHeading>
          </div>

          <Reveal className="col-span-4 md:col-span-12 lg:col-span-5 lg:col-start-8">
            <div className="surface-3 mx-auto w-full max-w-[440px] rounded-[28px] p-3 transition-transform duration-300 hover:-translate-y-1">
              <CrateScene tag={status.color} score={score} />
              <div className="px-3 pb-1 pt-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="type-headline-sm">Export readiness</h3>
                  <span
                    className="type-label-sm inline-flex h-5 items-center rounded-md px-2 transition-colors duration-200"
                    style={{ color: status.color, background: `color-mix(in srgb, ${status.color} 14%, transparent)` }}
                    aria-live="polite"
                  >
                    {status.label}
                  </span>
                </div>
                <p className="type-body-sm mt-0.5 text-muted-foreground">Flip on what's already done.</p>

                <ul className="mt-3 divide-y divide-outline-variant">
                  {READINESS_QUESTIONS.map((q, i) => (
                    <li key={q.id} className="flex min-h-14 items-center justify-between gap-4 py-2">
                      <div className="min-w-0">
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

                <p className="type-body-sm mt-3 min-h-[20px] text-muted-foreground">
                  {gaps.length ? (
                    <>
                      <span className="font-semibold text-foreground">Fix first:</span> {gaps[0].fix}.
                    </>
                  ) : (
                    <>
                      <span className="font-semibold text-foreground">{verdict.title}</span> {verdict.copy}
                    </>
                  )}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button onClick={sendResult} className="px-3">
                    Book a consult <ArrowRight aria-hidden="true" />
                  </Button>
                  <Button variant="outline" onClick={() => setOn(READINESS_QUESTIONS.map(() => true))}>
                    Mark all done
                  </Button>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setOn(READINESS_QUESTIONS.map(() => false))}
                    className={cn('press type-label-md h-8 rounded-full px-2 text-primary-ink hover:bg-primary/10')}
                  >
                    Reset
                  </button>
                  <span className="type-label-sm text-muted-foreground">Indicative only · not legal advice</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
