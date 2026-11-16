import { Reveal } from '@/components/motion/Reveal';
import { SectionHeading } from '@/components/site/SectionHeading';

// Durations are placeholders until the firm confirms its service levels.
const STEPS = [
  { title: 'Scoping call', meta: 'Free · 30 min', copy: "You tell us the product, the market and what's already under way." },
  { title: 'Route plan', meta: '1–2 weeks', copy: 'One document: structure, registrations, duty position, risks and a fixed fee.' },
  { title: 'Paperwork', meta: 'Fixed fee', copy: 'We draft, file and manage local counsel, so you deal with one firm.' },
  { title: 'Ship & support', meta: 'Ongoing', copy: 'We stay on call for your first consignments, then handle renewals.' },
];

export const Process = () => (
  <section id="process" className="section">
    <div className="container">
      <div className="grid-12 items-start gap-y-0">
        <SectionHeading
          className="col-span-4 md:col-span-12 lg:col-span-4"
          eyebrow="How it works"
          title="Four steps from first call to first shipment."
        />

        <ol className="after-heading col-span-4 grid gap-4 sm:grid-cols-2 md:col-span-12 lg:col-span-8 lg:mt-0">
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.title} index={i}>
              <article className="surface-1 card-hover flex h-full items-start gap-4 rounded-[20px] p-4">
                {/* Bezel 64 (padding 8, radius 20) around a 48 well (radius 12). */}
                <div className="bezel shrink-0 rounded-[20px] !p-2">
                  <div
                    aria-hidden="true"
                    className="bezel-well flex h-12 w-12 items-center justify-center rounded-[12px] font-mono text-[18px] font-semibold leading-none text-primary-ink tabular"
                  >
                    <span className="translate-y-[0.5px]">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="type-mono-sm text-primary-ink">{s.meta}</p>
                  <h3 className="type-title-md mt-1">
                    <span className="sr-only">Step {i + 1}: </span>
                    {s.title}
                  </h3>
                  <p className="type-body-sm mt-1 text-muted-foreground">{s.copy}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </ol>
      </div>
    </div>
  </section>
);
