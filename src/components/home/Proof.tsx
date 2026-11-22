import { Quote } from 'lucide-react';
import { PLACEHOLDER, STATS, TESTIMONIALS } from '@/data/proof';
import { Badge } from '@/components/ui/badge';
import { CountUp } from '@/components/motion/CountUp';
import { Reveal } from '@/components/motion/Reveal';
import { SectionHeading } from '@/components/site/SectionHeading';

const initials = (who: string) =>
  who
    .replace(/\(.*?\)/g, '')
    .split(/[ ,]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

export const Proof = () => (
  <section id="proof" className="section band-ink">
    <div className="container">
      <SectionHeading index="08"
          eyebrow="Results" title="Small exporters, cleared to sell.">
        {PLACEHOLDER && (
          <Badge variant="warning" className="mt-4">
            Sample data
          </Badge>
        )}
      </SectionHeading>

      {/* v3.11: one stat strip (the same anatomy as the hero's problems strip) instead of four pebbles. */}
      <Reveal className="after-heading">
        <dl className="surface-2 grid grid-cols-2 rounded-[14px] lg:grid-cols-4">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={[
                'flex flex-col justify-start gap-1 px-5 py-5 md:px-7 md:py-7',
                i % 2 === 1 ? 'border-l border-outline-variant' : '',
                i >= 2 ? 'border-t border-outline-variant lg:border-t-0' : '',
                i === 2 ? 'lg:border-l' : '',
              ].join(' ')}
            >
              <dt className="type-body-sm text-muted-foreground">{s.label}</dt>
              <dd className="order-first type-headline-lg tabular font-semibold text-primary-ink">
                <CountUp value={s.value} suffix={s.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <ul className="no-scrollbar -mx-4 mt-4 md:mt-5 xl:mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-3 md:gap-x-5 md:gap-y-0 md:overflow-visible md:px-0 xl:gap-x-6">
        {TESTIMONIALS.map((t, i) => (
          <Reveal as="li" key={t.who} index={i} className="w-[84vw] shrink-0 snap-center md:row-span-3 md:grid md:w-auto md:grid-rows-subgrid">
            {/* Subgrid rows keep quote marks, quotes and captions aligned across the three cards. */}
            <figure className="surface-1 card-hover flex h-full flex-col rounded-[12px] p-6 md:row-span-3 md:grid md:grid-rows-subgrid">
              <Quote className="h-5 w-5 text-primary-ink" aria-hidden="true" />
              <blockquote className="type-body-lg mb-6 mt-4 text-pretty">{t.quote}</blockquote>
              <figcaption className="card-foot flex items-center gap-3 md:mt-0">
                <span className="icon-well type-label-md flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-primary-ink">
                  {initials(t.who)}
                </span>
                <div className="min-w-0">
                  <div className="type-label-lg">{t.who}</div>
                  <div className="type-label-sm text-muted-foreground">{t.route}</div>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </ul>
    </div>
  </section>
);
