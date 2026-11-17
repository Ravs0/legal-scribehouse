import { SERVICES } from '@/data/services';
import { Badge } from '@/components/ui/badge';
import { Reveal } from '@/components/motion/Reveal';
import { SectionHeading } from '@/components/site/SectionHeading';
import { CardFooter, CardHeader } from '@/components/site/CardHeader';

export const Services = () => (
  <section id="services" className="section">
    <div className="container">
      <SectionHeading
        eyebrow="What we do"
        title="Six jobs we take off your desk."
        subtitle="Hire us for one, or for the whole route from structure to first shipment."
      />
      <ul className="after-heading stack-gap grid sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s, i) => (
          <Reveal as="li" key={s.id} index={i}>
            <article className="surface-1 card-hover card-shell h-full rounded-[20px]">
              <CardHeader icon={s.icon} title={s.title} />
              <p className="card-body type-body-md text-muted-foreground">{s.copy}</p>
              <CardFooter className="flex flex-wrap items-center gap-2">
                <span className="type-label-sm text-muted-foreground">You get</span>
                <Badge>{s.deliverable}</Badge>
              </CardFooter>
            </article>
          </Reveal>
        ))}
      </ul>
    </div>
  </section>
);
