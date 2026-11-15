import { Button } from '@/components/ui/button';
import { HashLink } from '@/components/site/HashLink';
import { SectionLabel } from '@/components/site/SectionLabel';
import { Reveal } from '@/components/motion/Reveal';
import { SITE } from '@/config/site';

const PRINCIPLES = [
  {
    title: 'Plain answers',
    copy: 'We name the document, the regulator and the deadline. If the answer is "it depends", we tell you what it depends on.',
  },
  {
    title: 'Fixed fees where we can',
    copy: 'Most work is scoped up front, so you know the number before we start and can budget the whole route.',
  },
  {
    title: 'Local counsel, coordinated',
    copy: 'Where local-law advice is needed, it comes from, or together with, locally qualified practitioners. You deal with one desk.',
  },
  {
    title: 'Built for small teams',
    copy: 'No in-house lawyer? That is who we work for. Checklists, templates and briefings your team can reuse.',
  },
];

const About = () => (
  <div className="container py-14 md:py-20">
    <SectionLabel index="AB" label="ABOUT" />
    <h1 className="max-w-4xl text-[clamp(2.25rem,6vw,4rem)] font-semibold leading-[1.05] tracking-tight">
      Export counsel for businesses that don't have a <em className="font-medium text-accent">legal department</em>.
    </h1>
    <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
      {SITE.name} helps small and growing product businesses sell into Southeast Asia: choosing a market-entry
      structure, getting products registered, using trade agreements properly, protecting their brand, and signing
      contracts that hold up when something goes wrong.
    </p>

    <ul className="mt-14 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2">
      {PRINCIPLES.map((p, i) => (
        <Reveal as="li" key={p.title} index={i} className="bg-background p-6 md:p-8">
          <div className="label-mono text-accent">P-{String(i + 1).padStart(2, '0')}</div>
          <h2 className="mt-3 text-2xl font-semibold">{p.title}</h2>
          <p className="mt-2 text-muted-foreground">{p.copy}</p>
        </Reveal>
      ))}
    </ul>

    <div className="mt-14 flex flex-col items-start gap-4 border-t border-dashed border-rule pt-8 sm:flex-row sm:items-center sm:justify-between">
      <p className="font-display text-2xl font-semibold">Planning your first shipment?</p>
      <Button asChild size="lg" className="arrow-nudge h-12 rounded-sm px-6">
        <HashLink to="contact">
          Book a free 30-minute consult <span className="arrow ml-1 font-mono">-&gt;</span>
        </HashLink>
      </Button>
    </div>
  </div>
);

export default About;
