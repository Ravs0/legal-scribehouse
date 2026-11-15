import { Quote } from 'lucide-react';
import { PLACEHOLDER, STATS, TESTIMONIALS } from '@/data/proof';
import { Badge } from '@/components/ui/badge';
import { CountUp } from '@/components/motion/CountUp';
import { Reveal } from '@/components/motion/Reveal';
import { SectionHeading } from '@/components/site/SectionHeading';
import { tilt } from '@/hooks/usePointerGlow';

const initials = (who: string) =>
  who
    .replace(/\(.*?\)/g, '')
    .split(/[ ,]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

export const Proof = () => (
  <section id="proof" className="section">
    <div className="container">
      <div className="grid-12">
        <SectionHeading
          className="col-span-4 md:col-span-7"
          eyebrow="Results"
          title={
            <>
              Small exporters, cleared to sell.
              {PLACEHOLDER && (
                <Badge variant="warning" className="ml-3 align-middle">
                  Sample data
                </Badge>
              )}
            </>
          }
        />
      </div>

      <dl className="after-heading stack-gap grid grid-cols-2 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal key={s.label} index={i} className="glass-subtle lift-card flex flex-col-reverse rounded-lg p-5 md:p-6">
            <dt className="type-body-sm mt-2 text-muted-foreground">{s.label}</dt>
            <dd className="type-display-md text-gradient tabular">
              <CountUp value={s.value} suffix={s.suffix} />
            </dd>
          </Reveal>
        ))}
      </dl>

      <ul className="no-scrollbar -mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 xl:gap-8">
        {TESTIMONIALS.map((t, i) => (
          <Reveal as="li" key={t.who} index={i} className="w-[86vw] shrink-0 snap-center md:w-auto">
            <figure {...tilt} className="glass-subtle lift-card card-pad flex h-full flex-col rounded-lg">
              <Quote className="h-6 w-6 text-primary" aria-hidden="true" />
              <blockquote className="type-body-lg mt-4 flex-1">{t.quote}</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-outline-variant pt-5">
                <span className="pebble type-label-md flex h-10 w-10 shrink-0 items-center justify-center bg-tertiary-container text-tertiary-on-container">
                  {initials(t.who)}
                </span>
                <div className="min-w-0">
                  <div className="type-label-lg">{t.who}</div>
                  <Badge variant="tertiary" className="mt-1">
                    {t.route}
                  </Badge>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </ul>
    </div>
  </section>
);
