import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/site/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { ScoreGauge } from '@/components/home/ScoreGauge';
import { MAX_SCORE, READINESS_QUESTIONS, verdictFor } from '@/data/readiness';
import { spawnRipple } from '@/hooks/useRipple';
import { useEnquiryDraft } from '@/stores/enquiryDraft';
import { cn } from '@/lib/utils';

const STATUS = {
  HOLD: { label: 'Hold', badge: 'destructive', color: 'hsl(var(--destructive))' },
  INSPECT: { label: 'Inspect', badge: 'warning', color: 'hsl(var(--warning))' },
  CLEARED: { label: 'Cleared', badge: 'success', color: 'hsl(var(--success))' },
} as const;

export const ReadinessCheck = () => {
  const total = READINESS_QUESTIONS.length;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => Array(total).fill(null));
  const prefill = useEnquiryDraft((s) => s.prefill);
  const advanceTimer = useRef<number>();
  const headingRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => () => window.clearTimeout(advanceTimer.current), []);

  const done = step >= total;
  const score = answers.reduce<number>((sum, a) => sum + (a ?? 0), 0);
  const verdict = verdictFor(score);
  const status = STATUS[verdict.stamp];
  const gaps = useMemo(
    () =>
      READINESS_QUESTIONS.map((q, i) => ({ q, score: answers[i] ?? 0 }))
        .filter((g) => g.score < 2)
        .sort((a, b) => a.score - b.score)
        .slice(0, 3),
    [answers],
  );

  const go = (next: number) => {
    setStep(next);
    // Keep keyboard and screen-reader users oriented on the new question.
    window.requestAnimationFrame(() => headingRef.current?.focus({ preventScroll: true }));
  };

  const choose = (value: number) => {
    setAnswers((prev) => prev.map((a, i) => (i === step ? value : a)));
    window.clearTimeout(advanceTimer.current);
    if (step < total - 1) advanceTimer.current = window.setTimeout(() => go(step + 1), 250);
  };

  const restart = () => {
    setAnswers(Array(total).fill(null));
    go(0);
  };

  const sendResult = () => {
    const lines = [
      `I took the export readiness check and scored ${score}/${MAX_SCORE} (${status.label}).`,
      ...(gaps.length ? ['Gaps to fix first:', ...gaps.map((g) => `- ${g.q.fix}`)] : []),
      '',
      'About my product and target market: ',
    ];
    prefill(lines.join('\n'));
    document.getElementById('contact')?.scrollIntoView({ block: 'start' });
    window.setTimeout(() => document.getElementById('enquiry-message')?.focus({ preventScroll: true }), 600);
  };

  const q = READINESS_QUESTIONS[Math.min(step, total - 1)];
  const progress = done ? 1 : step / total;

  return (
    <section id="readiness" className="section">
      <div className="container">
        <div className="grid-12 items-start gap-y-8">
          <div className="col-span-4 md:col-span-12 lg:sticky lg:top-[120px] lg:col-span-5">
            <SectionHeading
              eyebrow="Readiness check"
              title="Is your product ready to ship?"
              subtitle="Answer six quick questions. Get a clear status and the first things to fix."
            >
              <ul className="mt-8 space-y-3">
                {['6 questions', 'No email needed', 'Instant result'].map((t) => (
                  <li key={t} className="type-body-md flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-tertiary/[0.16] text-tertiary">
                      <Check className="h-4 w-4" aria-hidden="true" />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </SectionHeading>
          </div>

          <Reveal className="col-span-4 md:col-span-12 lg:col-span-7">
            <div className="glass liquid-sheen panel-pad overflow-hidden rounded-xl">
              <div className="flex items-center justify-between gap-4">
                <span className="type-label-md text-muted-foreground">
                  {done ? 'Your result' : `Question ${step + 1} of ${total}`}
                </span>
                <span className="type-label-md tabular text-muted-foreground">{Math.round(progress * 100)}%</span>
              </div>
              <div
                className="mt-3 h-1 overflow-hidden rounded-full bg-surface-high"
                role="progressbar"
                aria-label="Readiness check progress"
                aria-valuemin={0}
                aria-valuemax={total}
                aria-valuenow={done ? total : step}
              >
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-medium2 ease-standard"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>

              <div aria-live="polite">
                {!done ? (
                  <div key={q.id} className="animate-step-in">
                    <p ref={headingRef} tabIndex={-1} id={`q-${q.id}`} className="type-headline-sm mt-6 outline-none">
                      {q.question}
                    </p>
                    <div role="radiogroup" aria-labelledby={`q-${q.id}`} className="mt-6 grid gap-3">
                      {q.options.map((opt, i) => {
                        const selected = answers[step] === i;
                        return (
                          <button
                            key={opt}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            onClick={() => choose(i)}
                            onPointerDown={(e) => spawnRipple(e.currentTarget, e.clientX, e.clientY)}
                            className={cn(
                              'state-layer type-body-md relative flex min-h-14 w-full items-center gap-3 overflow-hidden rounded-md p-4 text-left text-foreground transition-colors duration-short3',
                              selected
                                ? 'border-2 border-primary bg-primary/10 p-[15px]'
                                : 'border border-outline-variant bg-card/40',
                            )}
                          >
                            <span
                              aria-hidden="true"
                              className={cn(
                                'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2',
                                selected ? 'border-primary' : 'border-input',
                              )}
                            >
                              {selected && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
                            </span>
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                      <Button
                        variant="ghost"
                        icon="leading"
                        onClick={() => go(Math.max(0, step - 1))}
                        disabled={step === 0}
                        className="-ml-3 disabled:bg-transparent"
                      >
                        <ArrowLeft aria-hidden="true" /> Back
                      </Button>
                      {step === total - 1 && (
                        <Button icon="trailing" onClick={() => go(total)} disabled={answers[step] === null}>
                          See my result <ArrowRight aria-hidden="true" />
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="animate-step-in">
                    <div className="mt-6 flex flex-col items-center text-center">
                      <ScoreGauge score={score} max={MAX_SCORE} color={status.color} />
                      <Badge variant={status.badge} className="mt-4">
                        {status.label}
                      </Badge>
                      <p ref={headingRef} tabIndex={-1} className="type-headline-sm mt-3 outline-none">
                        {verdict.title}
                      </p>
                      <p className="type-body-md mt-2 max-w-[48ch] text-muted-foreground">{verdict.copy}</p>
                    </div>

                    {gaps.length > 0 && (
                      <div className="mt-8 rounded-lg border border-outline-variant p-5">
                        <h4 className="type-title-sm">Fix first</h4>
                        <ol className="mt-4 space-y-4">
                          {gaps.map((g, i) => (
                            <li key={g.q.id} className="flex gap-3">
                              <span className="type-label-md flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-container text-primary-on-container">
                                {i + 1}
                              </span>
                              <div>
                                <p className="type-body-md">{g.q.fix}</p>
                                <p className="type-body-sm text-muted-foreground">{g.q.service}</p>
                              </div>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                      <Button size="lg" icon="trailing" onClick={sendResult} className="w-full sm:w-auto">
                        Book a consult about this <ArrowRight aria-hidden="true" />
                      </Button>
                      <Button variant="ghost" icon="leading" onClick={restart}>
                        <RotateCcw aria-hidden="true" /> Start over
                      </Button>
                    </div>
                    <p className="type-body-sm mt-6 text-muted-foreground">Indicative only. Not legal advice.</p>
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
