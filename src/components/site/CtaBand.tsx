import { ArrowRight } from 'lucide-react';
import { HashLink } from '@/components/site/HashLink';
import { spawnRipple } from '@/hooks/useRipple';

/** Closing call-to-action used at the end of every non-home page. */
export const CtaBand = () => (
  <section className="container pb-16 md:pb-24">
    <div
      className="rounded-xl px-8 py-8 text-center md:rounded-2xl md:p-12"
      style={{
        background: 'linear-gradient(135deg, hsl(var(--aurora-1) / 0.9), hsl(var(--aurora-2) / 0.8))',
        color: 'hsl(232 45% 8%)',
      }}
    >
      <h2 className="type-headline-md mx-auto max-w-[24ch]">Planning your first ASEAN shipment?</h2>
      <p className="type-body-lg mx-auto mt-4 max-w-[48ch] opacity-80">
        A free 30-minute call is the fastest way to find out what you need, and what you don't.
      </p>
      <HashLink
        to="contact"
        onPointerDown={(e) => spawnRipple(e.currentTarget, e.clientX, e.clientY)}
        className="state-layer press type-title-sm relative mt-8 inline-flex h-[52px] items-center gap-2.5 overflow-hidden rounded-full bg-white pl-8 pr-6 shadow-elevation-2"
        style={{ color: 'hsl(232 45% 12%)' }}
      >
        Book a consult <ArrowRight className="h-5 w-5" aria-hidden="true" />
      </HashLink>
    </div>
  </section>
);
