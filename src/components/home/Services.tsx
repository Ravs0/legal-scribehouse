import { SERVICES } from '@/data/services';
import { Reveal } from '@/components/motion/Reveal';
import { SectionLabel } from '@/components/site/SectionLabel';

export const Services = () => (
  <section id="services" className="scroll-mt-20 py-20 md:py-28">
    <div className="container">
      <SectionLabel index="04" label="WHAT WE HANDLE" />
      <Reveal>
        <h2 className="text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
          What we <em className="font-medium text-accent">handle</em>.
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Six pieces of work that decide whether an export runs smoothly. Take one, or let us run the whole route.
        </p>
      </Reveal>
      <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s, i) => {
          const Icon = s.icon;
          return (
            <Reveal as="li" key={s.id} index={i}>
              <article className="hard-hover group relative flex h-full flex-col border border-border bg-card p-6">
                <span aria-hidden="true" className="absolute right-3 top-2 font-mono text-lg text-ascii">
                  <span className="group-hover:hidden">+</span>
                  <span className="hidden text-accent group-hover:inline">*</span>
                </span>
                <div className="label-mono text-muted-foreground">
                  S-{String(i + 1).padStart(2, '0')}
                </div>
                <Icon aria-hidden="true" className="mt-5 h-6 w-6 text-primary" strokeWidth={1.5} />
                <h3 className="mt-4 text-xl font-semibold leading-snug">{s.title}</h3>
                <p className="mt-2 flex-1 text-muted-foreground">{s.copy}</p>
                <div className="mt-6 border-t border-dashed border-rule pt-3 font-mono text-xs uppercase tracking-[0.1em]">
                  <span className="text-muted-foreground">You get: </span>
                  <span className="text-foreground">{s.deliverable}</span>
                </div>
              </article>
            </Reveal>
          );
        })}
      </ul>
    </div>
  </section>
);
