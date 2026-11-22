import { Badge } from '@/components/ui/badge';
import { Reveal } from '@/components/motion/Reveal';
import { SectionHeading } from '@/components/site/SectionHeading';
import { PLACEHOLDER, TEAM } from '@/data/team';

/** Neutral portrait frame used until a real photo is supplied. */
const Frame = () => (
  <svg viewBox="0 0 360 450" className="absolute inset-x-0 bottom-0 mx-auto h-[86%] w-auto" aria-hidden="true">
    <circle cx="180" cy="150" r="76" fill="hsl(var(--foreground) / 0.14)" />
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

      <ul className="after-heading stack-gap grid md:grid-cols-3">
        {TEAM.map((p, i) => (
          <Reveal as="li" key={p.name} index={i} className="h-full">
            <article className="surface-1 card-hover grid h-full grid-cols-[88px_minmax(0,1fr)] overflow-hidden rounded-[12px] md:flex md:flex-col">
              <div className="relative min-h-[120px] overflow-hidden border-r border-outline-variant bg-secondary md:aspect-[16/11] md:border-b md:border-r-0">
                {p.photo ? (
                  <img src={p.photo} alt={p.name} className="absolute inset-0 h-full w-full object-cover object-top grayscale-[20%]" loading="lazy" />
                ) : (
                  <Frame />
                )}
                <span className="type-mono-sm absolute left-3 top-3 hidden rounded-[6px] bg-card/90 px-2 py-1 text-muted-foreground shadow-sm backdrop-blur md:inline">
                  {p.base}
                </span>
              </div>
              <div className="flex min-w-0 flex-col p-4 md:flex-1 md:p-5 lg:p-6">
                <h3 className="type-title-lg">{p.name}</h3>
                <p className="type-label-lg mt-0.5 text-primary-ink">
                  {p.role}
                  <span className="font-medium text-muted-foreground md:hidden"> · {p.base}</span>
                </p>
                <p className="type-body-md mt-2 text-muted-foreground md:mt-3 md:mb-4">{p.focus}</p>
                <p className="type-body-sm mt-3 border-t border-outline-variant pt-3 text-muted-foreground md:mt-auto md:min-h-[calc(2lh+1rem)] md:pt-4">
                  {p.admitted}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </ul>
    </div>
  </section>
);
