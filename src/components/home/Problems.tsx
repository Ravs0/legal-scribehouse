import { AlertTriangle, FileX, PackageX } from 'lucide-react';
import { IconContainer } from '@/components/ui/chip';
import { Reveal } from '@/components/motion/Reveal';
import { SectionHeading } from '@/components/site/SectionHeading';
import { pointerGlow } from '@/hooks/usePointerGlow';

const PROBLEMS = [
  {
    icon: PackageX,
    title: 'Held at the port',
    copy: 'Goods held at the port because the HS code or permit was wrong.',
  },
  {
    icon: AlertTriangle,
    title: 'Brand taken first',
    copy: 'A distributor who registered your trademark before you did.',
  },
  {
    icon: FileX,
    title: 'Duty overpaid',
    copy: 'Paying full duty when a trade agreement would have cut it, if the origin paperwork had been right.',
  },
];

export const Problems = () => (
  <section id="problems" className="section">
    <div className="container">
      <div className="grid-12">
        <SectionHeading
          className="col-span-4 md:col-span-7"
          eyebrow="Why exports stall"
          title="Three problems that stop a first shipment."
        />
      </div>
      <ul className="grid-12 after-heading">
        {PROBLEMS.map((p, i) => (
          <Reveal as="li" key={p.title} index={i} className="col-span-4">
            <article onMouseMove={pointerGlow} className="glass-subtle lift-card card-pad h-full rounded-lg">
              <IconContainer icon={p.icon} size="sm" tone="destructive" />
              <h3 className="type-title-lg mt-5">{p.title}</h3>
              <p className="type-body-md mt-2 text-muted-foreground">{p.copy}</p>
            </article>
          </Reveal>
        ))}
      </ul>
    </div>
  </section>
);
