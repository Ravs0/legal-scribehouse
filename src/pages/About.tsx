import { Compass, Handshake, Receipt, Users } from 'lucide-react';
import { IconContainer } from '@/components/ui/chip';
import { Badge } from '@/components/ui/badge';
import { CountUp } from '@/components/motion/CountUp';
import { Reveal } from '@/components/motion/Reveal';
import { CtaBand } from '@/components/site/CtaBand';
import { SectionHeading } from '@/components/site/SectionHeading';
import { SITE } from '@/config/site';
import { PLACEHOLDER, STATS } from '@/data/proof';
import { tilt } from "@/hooks/usePointerGlow";

const PRINCIPLES = [
  {
    icon: Compass,
    title: 'Plain answers',
    copy: 'We name the document, the regulator and the deadline. If the answer is "it depends", we tell you what it depends on.',
  },
  {
    icon: Receipt,
    title: 'Fixed fees where we can',
    copy: 'Most work is scoped up front, so you know the number before we start and can budget the whole route.',
  },
  {
    icon: Handshake,
    title: 'Local counsel, coordinated',
    copy: 'Where local-law advice is needed, it comes from, or together with, locally qualified practitioners. You deal with one team.',
  },
];

const About = () => (
  <>
    <section className="container pb-16 pt-12 md:pt-16">
      <div className="grid-12">
        <SectionHeading
          as="h1"
          className="col-span-4 md:col-span-8"
          eyebrow="About"
          title="Trade counsel sized for small exporters."
          subtitle={`${SITE.name} helps small and growing product businesses sell into Southeast Asia, without a legal department.`}
        />
      </div>

      <div className="grid-12 after-heading">
        <Reveal className="glass panel-pad col-span-4 rounded-xl md:col-span-12 lg:col-span-7">
          <IconContainer icon={Users} />
          <h2 className="type-headline-sm mt-6">Why we exist</h2>
          <div className="type-body-lg mt-4 space-y-4 text-muted-foreground">
            <p>
              Large companies have legal teams who know what a distributor agreement should say, which agency registers
              a cosmetic in Indonesia, and how to prove origin for a lower tariff. Small exporters usually find out the
              hard way.
            </p>
            <p>
              We close that gap: market-entry structure, contracts, customs and FTAs, product registration, trademarks
              and dispute planning, explained clearly and priced up front.
            </p>
          </div>
        </Reveal>
        <div className="stack-gap col-span-4 grid grid-cols-2 md:col-span-12 lg:col-span-5">
          {STATS.map((s, i) => (
            <Reveal key={s.label} index={i} className="glass-subtle flex flex-col justify-center rounded-lg p-5 md:p-6">
              <span className="type-display-md text-gradient tabular">
                <CountUp value={s.value} suffix={s.suffix} />
              </span>
              <span className="type-body-sm mt-2 text-muted-foreground">{s.label}</span>
            </Reveal>
          ))}
          {PLACEHOLDER && (
            <Badge variant="warning" className="col-span-2 justify-self-start">
              Sample data
            </Badge>
          )}
        </div>
      </div>
    </section>

    <section className="container pb-16 md:pb-24">
      <SectionHeading eyebrow="How we work" title="Three promises we keep." />
      <ul className="after-heading stack-gap grid md:grid-cols-3">
        {PRINCIPLES.map((p, i) => (
          <Reveal as="li" key={p.title} index={i}>
            <article {...tilt} className="glass-subtle lift-card card-pad h-full rounded-lg">
              <IconContainer icon={p.icon} />
              <h3 className="type-title-lg mt-5">{p.title}</h3>
              <p className="type-body-md mt-2 text-muted-foreground">{p.copy}</p>
            </article>
          </Reveal>
        ))}
      </ul>
    </section>
    <CtaBand />
  </>
);

export default About;
