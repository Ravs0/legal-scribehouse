import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Stamp } from '@/components/motion/Stamp';
import { Reveal } from '@/components/motion/Reveal';
import { SectionLabel } from '@/components/site/SectionLabel';
import { MAX_SCORE, READINESS_QUESTIONS, verdictFor } from '@/data/readiness';
import { useEnquiryDraft } from '@/stores/enquiryDraft';

const Progress = ({ step, total }: { step: number; total: number }) => (
  <span className="font-mono text-sm" aria-hidden="true">
    [<span className="text-accent">{'#'.repeat(step)}</span>
    <span className="text-muted-foreground">{'-'.repeat(total - step)}</span>] {step}/{total}
  </span>
);

export const ReadinessCheck = () => {
  const total = READINESS_QUESTIONS.length;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => Array(total).fill(null));
  const prefill = useEnquiryDraft((s) => s.prefill);

  const done = step >= total;
  const score = answers.reduce<number>((sum, a) => sum + (a ?? 0), 0);
  const verdict = verdictFor(score);

  const gaps = useMemo(
    () =>
      READINESS_QUESTIONS.map((q, i) => ({ q, score: answers[i] ?? 0 }))
        .filter((g) => g.score < 2)
        .sort((a, b) => a.score - b.score)
        .slice(0, 3),
    [answers],
  );

  const restart = () => {
    setAnswers(Array(total).fill(null));
    setStep(0);
  };

  const sendResult = () => {
    const lines = [
      `I took the export readiness check and scored ${score}/${MAX_SCORE} (${verdict.stamp}).`,
      gaps.length > 0 ? `Gaps to fix first:\n${gaps.map((g) => `- ${g.q.fix}`).join('\n')}` : '',
      '',
      'About my product and target market: ',
    ];
    prefill(lines.filter((l, i) => l !== '' || i === 2).join('\n'));
    document.getElementById('contact')?.scrollIntoView({ block: 'start' });
    window.setTimeout(() => document.getElementById('enquiry-message')?.focus({ preventScroll: true }), 600);
  };

  const q = READINESS_QUESTIONS[Math.min(step, total - 1)];

  return (
    <section id="check" className="scroll-mt-20 py-20 md:py-28">
      <div className="container grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionLabel index="06" label="READINESS CHECK" />
          <Reveal>
            <h2 className="text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
              Are you ready to <em className="font-medium text-accent">ship</em>?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Two minutes, six questions. You'll get a clearance verdict and the gaps worth fixing first. Nothing is
              stored or sent anywhere.
            </p>
            <pre
              aria-hidden="true"
              className="mt-10 hidden select-none font-mono text-xs leading-tight text-ascii lg:block"
            >{`   [ ]  HS code
   [ ]  Registration
   [ ]  Trademark
   [ ]  Contract
   [ ]  Origin / FTA
   [ ]  Payment terms`}</pre>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <div className="border border-border bg-card">
            <div className="label-mono flex items-center justify-between gap-4 border-b border-border px-5 py-3 text-muted-foreground">
              <span>Form RC-6 · Export readiness</span>
              <Progress step={done ? total : step} total={total} />
            </div>

            <div className="p-5 md:p-8" aria-live="polite">
              {!done ? (
                <fieldset key={q.id} className="duration-200 animate-in fade-in">
                  <legend className="label-mono mb-3 text-accent">
                    Question {step + 1} of {total}
                  </legend>
                  <p className="font-display text-2xl font-semibold leading-snug md:text-3xl">{q.question}</p>
                  <RadioGroup
                    className="mt-6 gap-3"
                    value={answers[step] === null ? '' : String(answers[step])}
                    onValueChange={(v) =>
                      setAnswers((prev) => prev.map((a, i) => (i === step ? Number(v) : a)))
                    }
                  >
                    {q.options.map((opt, i) => (
                      <Label
                        key={opt}
                        htmlFor={`${q.id}-${i}`}
                        className="flex cursor-pointer items-center gap-3 border border-border bg-background p-4 text-base font-normal transition-colors hover:border-primary has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
                      >
                        <RadioGroupItem id={`${q.id}-${i}`} value={String(i)} />
                        {opt}
                      </Label>
                    ))}
                  </RadioGroup>
                  <div className="mt-8 flex items-center justify-between">
                    <Button
                      type="button"
                      variant="ghost"
                      className="rounded-sm font-mono"
                      onClick={() => setStep((s) => Math.max(0, s - 1))}
                      disabled={step === 0}
                    >
                      &lt;- Back
                    </Button>
                    <Button
                      type="button"
                      className="arrow-nudge rounded-sm font-mono"
                      onClick={() => setStep((s) => s + 1)}
                      disabled={answers[step] === null}
                    >
                      {step === total - 1 ? 'See verdict' : 'Next'} <span className="arrow">-&gt;</span>
                    </Button>
                  </div>
                </fieldset>
              ) : (
                <div className="duration-300 animate-in fade-in">
                  <div className="flex flex-wrap items-center gap-6">
                    <Stamp sub={`${score} / ${MAX_SCORE}`} className="text-2xl">
                      {verdict.stamp}
                    </Stamp>
                    <div>
                      <p className="font-display text-3xl font-semibold">{verdict.title}</p>
                      <p className="mt-1 text-muted-foreground">{verdict.copy}</p>
                    </div>
                  </div>

                  {gaps.length > 0 && (
                    <div className="mt-8 border-t border-dashed border-rule pt-5">
                      <div className="label-mono mb-3 text-muted-foreground">Fix first</div>
                      <ul className="space-y-3">
                        {gaps.map((g) => (
                          <li key={g.q.id} className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
                            <span className="font-mono text-accent" aria-hidden="true">
                              [!]
                            </span>
                            <span className="flex-1">{g.q.fix}</span>
                            <span className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">
                              {g.q.service}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Button type="button" className="arrow-nudge h-11 rounded-sm" onClick={sendResult}>
                      Send my result with a consult request <span className="arrow ml-1 font-mono">-&gt;</span>
                    </Button>
                    <Button type="button" variant="ghost" className="rounded-sm font-mono" onClick={restart}>
                      Start over
                    </Button>
                  </div>
                  <p className="mt-6 font-mono text-xs text-muted-foreground">Indicative only. Not legal advice.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
