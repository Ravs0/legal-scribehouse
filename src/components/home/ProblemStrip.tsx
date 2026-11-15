import { Reveal } from '@/components/motion/Reveal';
import { SectionLabel } from '@/components/site/SectionLabel';

const PROBLEMS = [
  'Goods held at the port because the HS code or permit was wrong.',
  'A distributor who registered your trademark before you did.',
  'Paying full duty when a trade agreement would have cut it, if the origin paperwork had been right.',
];

export const ProblemStrip = () => (
  <section className="py-20 md:py-28">
    <div className="container">
      <SectionLabel index="02" label="THE USUAL SNAGS" />
      <Reveal>
        <h2 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
          Most export problems are <em className="font-medium text-accent">paperwork</em> problems.
        </h2>
      </Reveal>
      <ol className="mt-12 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
        {PROBLEMS.map((p, i) => (
          <Reveal as="li" key={p} index={i} className="bg-background p-6 md:p-8">
            <div className="label-mono mb-4 flex items-center justify-between text-muted-foreground">
              <span className="text-accent">Incident {String(i + 1).padStart(2, '0')}</span>
              <span aria-hidden="true">[ ! ]</span>
            </div>
            <p className="text-lg leading-snug">{p}</p>
          </Reveal>
        ))}
      </ol>
    </div>
  </section>
);
