import { useRef } from 'react';
import { useInView } from '@/hooks/useInView';
import { PLACEHOLDER, STATS, TESTIMONIALS } from '@/data/proof';
import { CountUp } from '@/components/motion/CountUp';
import { Reveal } from '@/components/motion/Reveal';
import { Stamp } from '@/components/motion/Stamp';
import { SectionLabel } from '@/components/site/SectionLabel';

export const Proof = () => {
  const stampRef = useRef<HTMLDivElement>(null);
  const stampIn = useInView(stampRef, { threshold: 0.6 });

  return (
    <section className="relative py-20 md:py-28">
      <div className="container">
        <SectionLabel index="07" label="TRACK RECORD" />
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <h2 className="text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
              Small exporters, <em className="font-medium text-accent">cleared</em>.
            </h2>
            {PLACEHOLDER && (
              <p className="mt-4 inline-block border border-dashed border-accent px-2 py-1 font-mono text-xs uppercase tracking-[0.12em] text-accent">
                Sample data · replace before launch
              </p>
            )}
          </Reveal>
          <div ref={stampRef} aria-hidden="true" className="hidden h-16 w-44 items-center justify-center md:flex">
            {stampIn && <Stamp sub="SGSIN">Cleared</Stamp>}
          </div>
        </div>

        <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden border border-border bg-border lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} index={i} className="bg-background p-5 md:p-8">
              <dt className="label-mono text-muted-foreground">{s.label}</dt>
              <dd className="mt-3 font-display text-4xl font-semibold md:text-5xl">
                <CountUp value={s.value} suffix={s.suffix} />
              </dd>
            </Reveal>
          ))}
        </dl>

        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal as="li" key={t.who} index={i}>
              <figure className="flex h-full flex-col border border-border bg-card p-6">
                <span aria-hidden="true" className="font-display text-5xl leading-none text-accent">
                  “
                </span>
                <blockquote className="mt-2 flex-1 text-lg leading-snug">{t.quote}</blockquote>
                <figcaption className="mt-6 border-t border-dashed border-rule pt-3">
                  <div className="font-medium">{t.who}</div>
                  <div className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">{t.route}</div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
};
