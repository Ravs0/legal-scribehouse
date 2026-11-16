import { SERVICES } from '@/data/services';
import { Badge } from '@/components/ui/badge';
import { IconContainer } from '@/components/ui/chip';
import { Reveal } from '@/components/motion/Reveal';
import { SectionHeading } from '@/components/site/SectionHeading';

export const Services = () => (
  <section id="services" className="section">
    <div className="container">
      <div className="grid-12">
        <SectionHeading
          className="col-span-4 md:col-span-7"
          eyebrow="What we do"
          title="Six ways we clear your path."
          subtitle="Take one piece of work, or let us run the whole route from structure to first shipment."
        />
      </div>
      <ul className="after-heading grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s, i) => (
          <Reveal as="li" key={s.id} index={i}>
            <article className="surface-1 card-hover card-pad flex h-full flex-col rounded-lg">
              <IconContainer icon={s.icon} />
              <h3 className="type-title-lg mt-3">{s.title}</h3>
              <p className="type-body-md mt-2 flex-1 text-muted-foreground">{s.copy}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-outline-variant pt-3">
                <span className="type-label-sm text-muted-foreground">You get</span>
                <Badge>{s.deliverable}</Badge>
              </div>
            </article>
          </Reveal>
        ))}
      </ul>
    </div>
  </section>
);
