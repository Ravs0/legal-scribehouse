import { Reveal } from '@/components/motion/Reveal';
import { SectionHeading } from '@/components/site/SectionHeading';
import { CardFooter, CardHeader } from '@/components/site/CardHeader';

// Durations are placeholders until the firm confirms its service levels.
const STEPS = [
  { title: 'Scoping call', meta: 'Free · 30 min', copy: "You tell us the product, the market and what's already under way." },
  { title: 'Route plan', meta: '1–2 weeks', copy: 'One document: structure, registrations, duty position, risks and a fixed fee.' },
  { title: 'Paperwork', meta: 'Fixed fee', copy: 'We draft, file and manage local counsel, so you deal with one firm.' },
  { title: 'Ship & support', meta: 'Ongoing', copy: 'We stay on call for your first consignments, then handle renewals.' },
];

export const Process = () => (
  <section id="process" className="section band">
    <div className="container">
      <SectionHeading index="03" eyebrow="How it works" title="Four steps from first call to first shipment." />

      {/* v3.8: one row of four from 1024, 2×2 from 640, one column on phones. */}
      <ol className="after-heading stack-gap grid sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <Reveal as="li" key={s.title} index={i}>
            <article className="surface-1 card-hover card-shell h-full rounded-[12px]">
              <CardHeader
                numeral={String(i + 1).padStart(2, '0')}
                title={
                  <>
                    <span className="sr-only">Step {i + 1}: </span>
                    {s.title}
                  </>
                }
              />
              <p className="card-body type-body-md text-muted-foreground">{s.copy}</p>
              <CardFooter>
                <span className="type-mono-sm text-muted-foreground">{s.meta}</span>
              </CardFooter>
            </article>
          </Reveal>
        ))}
      </ol>
    </div>
  </section>
);
