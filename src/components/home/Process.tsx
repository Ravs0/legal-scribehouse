import { useRef } from 'react';
import { useInView } from '@/hooks/useInView';
import { Reveal } from '@/components/motion/Reveal';
import { SectionHeading } from '@/components/site/SectionHeading';
import { cn } from '@/lib/utils';
import { tilt } from '@/hooks/usePointerGlow';

// Durations are placeholders until the firm confirms its service levels.
const STEPS = [
  { title: 'Scoping call', meta: 'Free · 30 min', copy: "Your product, target market, and what's already in motion." },
  { title: 'Route plan', meta: '1–2 weeks', copy: 'A written plan: structure, registrations, duty position, risks, fixed fee.' },
  { title: 'Paperwork', meta: 'Fixed fee', copy: 'We draft, file and coordinate local counsel.' },
  { title: 'Ship & support', meta: 'Ongoing', copy: 'On call for the first consignments and renewals.' },
];

const GRADIENT = 'linear-gradient(90deg, hsl(var(--aurora-1)), hsl(var(--aurora-2)))';

export const Process = () => {
  const ref = useRef<HTMLOListElement>(null);
  const inView = useInView(ref, { threshold: 0.3 });

  return (
    <section id="process" data-stage="process" className="section">
      <div className="container">
        <div className="grid-12">
          <SectionHeading
            className="col-span-4 md:col-span-7"
            eyebrow="How it works"
            title="From first call to first shipment in four steps."
          />
        </div>

        <ol ref={ref} className="after-heading stack-gap relative grid pl-12 lg:grid-cols-4 lg:pl-0">
          {/* Connector: vertical on mobile/tablet, horizontal at numeral height on desktop. */}
          <span
            aria-hidden="true"
            className={cn(
              'absolute bottom-10 left-5 top-10 w-0.5 origin-top rounded-full transition-transform [transition-duration:800ms] ease-emphasized lg:hidden',
              inView ? 'scale-y-100' : 'scale-y-0',
            )}
            style={{ background: 'linear-gradient(180deg, hsl(var(--aurora-1)), hsl(var(--aurora-2)))' }}
          />
          <span
            aria-hidden="true"
            className={cn(
              'absolute z-10 hidden h-0.5 origin-left rounded-full transition-transform [transition-duration:800ms] ease-emphasized lg:left-[44px] lg:right-[calc(25%-62px)] lg:top-[43px] lg:block xl:left-[48px] xl:right-[calc(25%-72px)] xl:top-[47px]',
              inView ? 'scale-x-100' : 'scale-x-0',
            )}
            style={{ background: GRADIENT }}
          />
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.title} index={i} className="relative">
              <span
                aria-hidden="true"
                className="pebble type-title-sm absolute -left-12 top-0 flex h-10 w-10 items-center justify-center bg-primary text-primary-foreground lg:hidden"
              >
                {i + 1}
              </span>
              <div {...tilt} className="glass-subtle lift-card card-pad h-full rounded-lg">
                <span
                  aria-hidden="true"
                  className="pebble type-title-sm relative z-20 hidden h-10 w-10 items-center justify-center bg-primary text-primary-foreground lg:flex"
                >
                  {i + 1}
                </span>
                <p className="type-label-md text-tertiary lg:mt-5">{s.meta}</p>
                <h3 className="type-title-lg mt-2">
                  <span className="sr-only">Step {i + 1}: </span>
                  {s.title}
                </h3>
                <p className="type-body-md mt-2 text-muted-foreground">{s.copy}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
};
