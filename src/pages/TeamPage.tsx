import '@/styles/polish-pages.css';
import { Badge } from '@/components/ui/badge';
import { CtaBand } from '@/components/site/CtaBand';
import { SectionHeading } from '@/components/site/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { PLACEHOLDER, TEAM } from '@/data/team';
import { MARKETS } from '@/data/markets';

/** /team: the people (from src/data/team.ts) and how local counsel fits in. */
const TeamPage = () => (
  <>
    <section className="container pg-top">
      <SectionHeading as="h1" index="—" eyebrow="Our desk" title="The people on your file." subtitle="A small team of lawyers in Singapore and Kuala Lumpur. The person on your first call stays on your file to the end.">
        {PLACEHOLDER && <Badge variant="warning" className="mt-4">Sample people</Badge>}
      </SectionHeading>
      <ul className="after-heading stack-gap grid sm:grid-cols-2 lg:grid-cols-3">
        {TEAM.map((p, i) => (
          <Reveal as="li" key={p.name} index={i} className="surface-1 card-hover flex flex-col rounded-[14px] p-5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[10px] border border-border bg-background">
              {p.photo ? <img src={p.photo} alt={p.name} className="absolute inset-0 h-full w-full object-cover" /> : (
                <svg viewBox="0 0 360 270" className="absolute inset-0 h-full w-full" aria-hidden="true">
                  <circle cx="180" cy="105" r="52" fill="hsl(var(--foreground) / 0.1)" />
                  <path d="M70 270c0-70 48-112 110-112s110 42 110 112z" fill="hsl(var(--foreground) / 0.08)" />
                </svg>
              )}
            </div>
            <h2 className="type-title-lg mt-4">{p.name}</h2>
            <p className="type-label-lg text-primary-ink">{p.role} · {p.base}</p>
            <p className="type-body-md mb-4 mt-2 text-muted-foreground">{p.focus}</p>
            <p className="type-body-sm mt-auto border-t border-border pt-3 text-muted-foreground">{p.admitted}</p>
          </Reveal>
        ))}
      </ul>
    </section>
    <section className="section band">
      <div className="container">
        <SectionHeading index="01" eyebrow="Local counsel" title="One firm, with a lawyer on the ground in every market." subtitle="Where a filing or opinion needs a locally qualified lawyer, we brief one we have worked with, manage the work, and include the cost in our fixed fee." />
        <ul className="after-heading grid grid-cols-2 gap-px overflow-hidden rounded-[12px] border border-border bg-border sm:grid-cols-5">
          {MARKETS.map((m) => (
            <li key={m.code} className="bg-card px-4 py-3">
              <p className="type-mono-sm text-muted-foreground">{m.code}</p>
              <p className="type-label-lg">{m.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
    <div className="pt-8 md:pt-12" />
    <CtaBand />
  </>
);

export default TeamPage;
