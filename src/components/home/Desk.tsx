import { Badge } from '@/components/ui/badge';
import { Reveal } from '@/components/motion/Reveal';
import { SectionHeading } from '@/components/site/SectionHeading';
import { PLACEHOLDER, TEAM } from '@/data/team';

/** Neutral portrait frame used until a real photo is supplied. */
const Frame = () => (
  <svg viewBox="0 0 360 450" className="absolute inset-x-0 bottom-0 mx-auto h-[86%] w-auto" aria-hidden="true">
    <circle cx="180" cy="150" r="76" fill="hsl(var(--foreground) / 0.12)" />
    <path d="M24 450c0-108 70-172 156-172s156 64 156 172z" fill="hsl(var(--foreground) / 0.09)" />
  </svg>
);

/** v4.0 "Your desk": the people on the file, straight after the hero. */
export const Desk = () => (
  <section id="desk" className="section">
    <div className="container">
      <SectionHeading
        index="01"
          eyebrow="Your desk"
        title="The people on your file."
        subtitle="A small team of lawyers in Singapore and Kuala Lumpur. The person on your first call stays on your file."
      >
        {PLACEHOLDER && (
          <Badge variant="warning" className="mt-4">
            Sample people
          </Badge>
        )}
      </SectionHeading>

      <ul className="after-heading stack-gap grid sm:grid-cols-2 lg:grid-cols-3">
        {TEAM.map((p, i) => (
          <Reveal as="li" key={p.name} index={i}>
            <article className="grid grid-cols-[96px_minmax(0,1fr)] gap-x-4 sm:block">
              <div className="relative row-span-4 aspect-[4/5] self-start overflow-hidden rounded-[8px] border border-border bg-card sm:rounded-[10px]">
                {p.photo ? (
                  <img src={p.photo} alt={p.name} className="absolute inset-0 h-full w-full object-cover grayscale-[20%]" loading="lazy" />
                ) : (
                  <Frame />
                )}
                <span className="type-mono-sm absolute left-3 top-3 hidden rounded-[5px] bg-background/80 px-2 py-1 text-muted-foreground backdrop-blur sm:inline">
                  {p.base}
                </span>
              </div>
              <h3 className="type-title-lg sm:mt-4">{p.name}</h3>
              <p className="type-label-lg text-primary-ink">
                {p.role}
                <span className="font-medium text-muted-foreground sm:hidden"> · {p.base}</span>
              </p>
              <p className="type-body-sm mt-1.5 text-muted-foreground sm:type-body-md sm:mt-2">{p.focus}</p>
              <p className="type-body-sm mt-2 text-muted-foreground sm:mt-3 sm:border-t sm:border-border sm:pt-3">{p.admitted}</p>
            </article>
          </Reveal>
        ))}
      </ul>
    </div>
  </section>
);
