import { MouseEvent, useRef, useState } from 'react';
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

const LENS = 72;
const ZOOM = 1.25;

/** Pill bezel with a stat; a surface-3 magnifier follows the pointer on desktop. */
const StatBezel = ({ value, suffix, label }: { value: number; suffix: string; label: string }) => {
  const wellRef = useRef<HTMLDivElement>(null);
  const [lens, setLens] = useState<{ x: number; y: number } | null>(null);
  const canLens = () =>
    window.matchMedia('(hover: hover) and (min-width: 1024px)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!canLens() || !wellRef.current) return;
    const r = wellRef.current.getBoundingClientRect();
    setLens({ x: e.clientX - r.left, y: e.clientY - r.top });
  };
  const numeral = (
    <>
      <span className="type-display-md text-gradient tabular block">
        {value}
        {suffix}
      </span>
      <span className="type-body-sm mt-1 block text-muted-foreground">{label}</span>
    </>
  );
  return (
    <div className="bezel card-hover rounded-full">
      <div
        ref={wellRef}
        onMouseMove={onMove}
        onMouseLeave={() => setLens(null)}
        className="bezel-well relative flex h-24 flex-col justify-center overflow-hidden rounded-full px-7 lg:h-[120px] lg:px-8"
      >
        <span className="type-display-md text-gradient tabular block">
          <CountUp value={value} suffix={suffix} />
        </span>
        <span className="type-body-sm mt-1 block text-muted-foreground">{label}</span>
        {lens && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute overflow-hidden rounded-full bg-[var(--well-fill)]"
            style={{
              width: LENS,
              height: LENS,
              left: lens.x - LENS / 2,
              top: lens.y - LENS / 2,
              boxShadow: 'inset 0 0 0 1px hsl(0 0% 100% / .7), inset 0 -8px 12px -6px hsl(0 0% 100% / .5), 0 6px 14px -6px hsl(24 40% 20% / .35)',
            }}
          >
            <span
              className="absolute flex flex-col justify-center px-7 lg:px-8"
              style={{
                width: wellRef.current?.clientWidth,
                height: wellRef.current?.clientHeight,
                transformOrigin: '0 0',
                transform: `translate(${LENS / 2 - lens.x * ZOOM}px, ${LENS / 2 - lens.y * ZOOM}px) scale(${ZOOM})`,
              }}
            >
              {numeral}
            </span>
            <span className="absolute inset-x-2 top-1 h-1/3 rounded-full bg-gradient-to-b from-white/50 to-transparent" />
          </span>
        )}
      </div>
    </div>
  );
};

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

      <dl className="after-heading stack-gap grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal key={s.label} index={i}>
            <dt className="sr-only">{s.label}</dt>
            <dd>
              <StatBezel value={s.value} suffix={s.suffix} label={s.label} />
            </dd>
          </Reveal>
        ))}
      </dl>

      <ul className="no-scrollbar -mx-4 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 xl:gap-6">
        {TESTIMONIALS.map((t, i) => (
          <Reveal as="li" key={t.who} index={i} className="w-[84vw] shrink-0 snap-center md:w-auto">
            <figure className="surface-1 card-hover flex h-full flex-col rounded-[20px] p-5">
              <Quote className="h-5 w-5 text-primary-ink" aria-hidden="true" />
              <blockquote className="type-body-lg mt-3 flex-1">{t.quote}</blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-outline-variant pt-4">
                <span className="type-label-md flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-tertiary-container text-tertiary-on-container">
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
