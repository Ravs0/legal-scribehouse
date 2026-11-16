import { Reveal } from '@/components/motion/Reveal';
import { SectionHeading } from '@/components/site/SectionHeading';
import { PIXEL, PixelIcon } from '@/components/site/PixelIcon';

// Durations are placeholders until the firm confirms its service levels.
const STEPS = [
  { icon: PIXEL.handshake, title: 'Scoping call', meta: 'Free · 30 min', copy: "Your product, target market, and what's already in motion." },
  { icon: PIXEL.document, title: 'Route plan', meta: '1–2 weeks', copy: 'A written plan: structure, registrations, duty position, risks, fixed fee.' },
  { icon: PIXEL.stamp, title: 'Paperwork', meta: 'Fixed fee', copy: 'We draft, file and coordinate local counsel.' },
  { icon: PIXEL.ship, title: 'Ship & support', meta: 'Ongoing', copy: 'On call for the first consignments and renewals.' },
];

export const Process = () => (
  <section id="process" className="section">
    <div className="container">
      <div className="grid-12 items-start gap-y-0">
        <SectionHeading
          className="col-span-4 md:col-span-12 lg:col-span-4"
          eyebrow="How it works"
          title="From first call to first shipment in four steps."
        />

        <ol className="after-heading col-span-4 grid gap-4 sm:grid-cols-2 md:col-span-12 lg:col-span-8 lg:mt-0">
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.title} index={i}>
              <article className="surface-1 card-hover flex h-full items-start gap-4 rounded-[20px] p-4">
                {/* Bezel 64 (padding 8, radius 20) around a 48 well (radius 12). */}
                <div className="bezel shrink-0 rounded-[20px] !p-2">
                  <div className="bezel-well flex h-12 w-12 items-center justify-center rounded-[12px] text-primary-ink">
                    <PixelIcon map={s.icon} cell={3} />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="type-mono-sm text-primary-ink">
                    {String(i + 1).padStart(2, '0')} · {s.meta}
                  </p>
                  <h3 className="type-title-md mt-1">
                    <span className="sr-only">Step {i + 1}: </span>
                    {s.title}
                  </h3>
                  <p className="type-body-sm mt-1 text-muted-foreground">{s.copy}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </ol>
      </div>
    </div>
  </section>
);
