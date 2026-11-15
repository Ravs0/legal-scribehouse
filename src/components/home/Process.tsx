import { useRef } from 'react';
import { useInView } from '@/hooks/useInView';
import { Reveal } from '@/components/motion/Reveal';
import { SectionLabel } from '@/components/site/SectionLabel';
import { cn } from '@/lib/utils';

// NOTE: durations are placeholders until the firm confirms its service levels.
const STEPS = [
  { title: 'Scoping call', meta: 'Free · 30 min', copy: "Your product, target market, and what's already in motion." },
  { title: 'Route plan', meta: '1–2 weeks', copy: 'A written plan: structure, registrations, duty position, risks, fixed fee.' },
  { title: 'Paperwork', meta: 'Fixed fee', copy: 'We draft, file and coordinate local counsel.' },
  { title: 'Ship & support', meta: 'Ongoing', copy: 'On call for the first consignments and renewals.' },
];

export const Process = () => {
  const ref = useRef<HTMLOListElement>(null);
  const inView = useInView(ref, { threshold: 0.3 });

  return (
    <section id="process" className="scroll-mt-20 border-y border-border bg-card/50 py-20 md:py-28">
      <div className="container">
        <SectionLabel index="05" label="HOW IT WORKS" />
        <Reveal>
          <h2 className="text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
            From first call to first <em className="font-medium text-accent">shipment</em>.
          </h2>
        </Reveal>

        <ol ref={ref} className="relative mt-14 grid gap-10 pl-8 md:grid-cols-4 md:gap-6 md:pl-0 md:pt-10">
          {/* The connector: vertical on mobile, horizontal from md up. It draws itself once. */}
          <span
            aria-hidden="true"
            className={cn(
              'absolute bottom-2 left-[7px] top-2 w-px origin-top border-l border-dashed border-primary transition-transform [transition-duration:1200ms] ease-out md:hidden',
              inView ? 'scale-y-100' : 'scale-y-0',
            )}
          />
          <span
            aria-hidden="true"
            className={cn(
              'absolute left-2 right-[12%] top-[7px] hidden h-px origin-left border-t border-dashed border-primary transition-transform [transition-duration:1200ms] ease-out md:block',
              inView ? 'scale-x-100' : 'scale-x-0',
            )}
          />
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative">
              <span
                aria-hidden="true"
                className={cn(
                  'absolute -left-8 top-0 flex h-4 w-4 items-center justify-center bg-background font-mono text-sm leading-none text-primary transition-colors md:-top-10 md:left-0',
                  inView && 'text-accent',
                )}
                style={{ transitionDelay: `${i * 300}ms` }}
              >
                o
              </span>
              <div className="label-mono flex items-center gap-3">
                <span className="text-accent">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-muted-foreground">{s.meta}</span>
              </div>
              <h3 className="mt-3 text-2xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-muted-foreground">{s.copy}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
