import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HashLink } from '@/components/site/HashLink';
import { Contours } from '@/components/site/Contours';

/** Closing call-to-action on inner pages: a dark device panel over contour lines. */
export const CtaBand = () => (
  <section className="container pb-16 md:pb-24">
    <div className="dark relative overflow-hidden rounded-[14px] device-surface bg-device px-6 py-10 text-center text-device-foreground md:px-12 md:py-14">
      <Contours className="absolute inset-0 h-full w-full" />
      <div className="relative">
        <h2 className="type-headline-md mx-auto max-w-[24ch]">Planning your first ASEAN shipment?</h2>
        <p className="type-body-lg mx-auto mt-3 max-w-[46ch] text-white/70">
          A free 30-minute call is the quickest way to find out what you need and what you can skip.
        </p>
        <Button asChild size="lg" className="mt-7">
          <HashLink to="contact">
            Book a free call <ArrowRight aria-hidden="true" />
          </HashLink>
        </Button>
      </div>
    </div>
  </section>
);
