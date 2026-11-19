import { BadgeCheck } from 'lucide-react';
import { SERVICES } from '@/data/services';
import { Badge } from '@/components/ui/badge';
import { Reveal } from '@/components/motion/Reveal';
import { SectionHeading } from '@/components/site/SectionHeading';
import { CardFooter, CardHeader } from '@/components/site/CardHeader';

/* v3.11: how pricing works, said up front. Few advisory sites state it; small exporters ask first. */
const TERMS = [
  { title: 'A fixed fee per job', copy: 'Quoted in writing after the free call, before any work starts.' },
  { title: 'No hourly billing', copy: 'Questions along the way are part of the job, not a new invoice.' },
  { title: 'Local counsel included', copy: 'Where a market needs a licensed local lawyer, we brief them and it is in the quote.' },
];

export const Services = () => (
  <section id="services" className="section">
    <div className="container">
      <SectionHeading
        index="02"
          eyebrow="What we do"
        title="Six jobs we take off your desk."
        subtitle="Hire us for one, or for the whole route from structure to first shipment."
      />
      <ul className="after-heading stack-gap grid sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s, i) => (
          <Reveal as="li" key={s.id} index={i}>
            <article className="surface-1 card-hover card-shell h-full rounded-[12px]">
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
      <Reveal className="mt-4 md:mt-5 xl:mt-6">
        <div className="surface-2 rounded-[14px]">
          <p className="type-label-md px-4 pt-4 text-muted-foreground md:px-5">How pricing works</p>
          <ul className="mt-1 grid divide-y divide-outline-variant md:grid-cols-3 md:divide-x md:divide-y-0">
            {TERMS.map((t) => (
              <li key={t.title} className="grid grid-cols-[20px_minmax(0,1fr)] content-start items-center gap-x-3 p-4 md:p-5">
                <BadgeCheck className="h-5 w-5 text-tertiary" strokeWidth={2} aria-hidden="true" />
                <h3 className="type-title-sm">{t.title}</h3>
                <p className="type-body-sm col-start-2 mt-1 text-muted-foreground">{t.copy}</p>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </div>
  </section>
);
