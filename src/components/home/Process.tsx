import { useEffect, useRef, useState } from 'react';
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

/** Fill fraction of the recessed track, linked to scroll position through the section. */
function useScrollProgress(ref: React.RefObject<HTMLElement>) {
  const [p, setP] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return setP(1);
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      setP(Math.max(0, Math.min(1, (vh * 0.8 - r.top) / (r.height + vh * 0.3))));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [ref]);
  return p;
}

export const Process = () => {
  const ref = useRef<HTMLOListElement>(null);
  const progress = useScrollProgress(ref);

  return (
    <section id="process" className="section">
      <div className="container">
        <div className="grid-12">
          <SectionHeading className="col-span-4 md:col-span-7" eyebrow="How it works" title="From first call to first shipment in four steps." />
        </div>

        <ol ref={ref} className="after-heading relative grid gap-8 pl-[60px] lg:grid-cols-4 lg:gap-6 lg:pl-0">
          {/* Recessed track: vertical on mobile, horizontal on desktop, filled in dawn orange as you scroll. */}
          <span aria-hidden="true" className="bezel-well absolute bottom-12 left-[21px] top-12 w-1.5 rounded-full lg:hidden">
            <span className="absolute inset-x-0 top-0 rounded-full bg-primary" style={{ height: `${progress * 100}%` }} />
          </span>
          <span aria-hidden="true" className="bezel-well absolute left-[60px] right-[calc(25%-60px)] top-[57px] hidden h-1.5 rounded-full lg:block">
            <span className="absolute inset-y-0 left-0 rounded-full bg-primary" style={{ width: `${progress * 100}%` }} />
          </span>

          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.title} index={i} className="relative">
              <div className="bezel absolute -left-[60px] top-0 rounded-[18px] !p-1.5 lg:static lg:inline-block lg:rounded-[30px] lg:!p-3">
                <div className="bezel-well flex h-[34px] w-[34px] items-center justify-center rounded-[13px] text-primary-ink lg:h-[96px] lg:w-[96px] lg:rounded-[22px]">
                  <PixelIcon map={s.icon} cell={5} className="hidden lg:block" />
                  <PixelIcon map={s.icon} cell={2} className="lg:hidden" />
                </div>
              </div>
              <p className="type-mono-sm mt-0 text-primary-ink lg:mt-5">
                {String(i + 1).padStart(2, '0')} · {s.meta}
              </p>
              <h3 className="type-title-lg mt-1.5">
                <span className="sr-only">Step {i + 1}: </span>
                {s.title}
              </h3>
              <p className="type-body-md mt-1.5 max-w-[30ch] text-muted-foreground">{s.copy}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
};
