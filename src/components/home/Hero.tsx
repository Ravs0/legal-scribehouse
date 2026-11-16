import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AssistChip } from '@/components/ui/chip';
import { HashLink } from '@/components/site/HashLink';
import { ClearancePrinter } from '@/components/home/ClearancePrinter';

const TRUST = ['10 ASEAN markets', '6 advisory services', '2-minute readiness check'];
const stagger = (ms: number) => ({ animationDelay: `${ms}ms` });

export const Hero = () => {
  return (
    <section className="flex items-center pb-16 pt-10 lg:pb-24 lg:pt-16">
      <div className="container">
        <div className="grid-12 items-center gap-y-10">
          <div className="col-span-4 md:col-span-12 lg:col-span-6">
            <div className="animate-fade-up" style={stagger(0)}>
              <AssistChip icon={Sparkles}>Export legal advisory · ASEAN</AssistChip>
            </div>
            <h1 className="type-display-lg mt-6 max-w-[18ch] animate-fade-up" style={stagger(80)}>
              Sell into Southeast Asia<span className="-ml-[0.07em]">.</span>{' '}
              <span className="text-gradient">
                Skip the legal surprises<span className="-ml-[0.07em]">.</span>
              </span>
            </h1>
            <p className="type-body-lg mt-6 max-w-[48ch] animate-fade-up text-muted-foreground" style={stagger(160)}>
              Structure, contracts, customs and product registration, sorted before your first shipment leaves. Built
              for small exporters, explained in plain English.
            </p>
            <div className="mt-8 flex animate-fade-up flex-col gap-3 sm:flex-row" style={stagger(240)}>
              <Button asChild size="lg" className="w-full sm:w-auto">
                <HashLink to="contact">
                  Book a consult <ArrowRight aria-hidden="true" />
                </HashLink>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                <HashLink to="readiness">Check my readiness</HashLink>
              </Button>
            </div>
            <ul
              className="type-body-sm mt-8 flex animate-fade-up flex-wrap items-center gap-x-3 gap-y-2 text-muted-foreground"
              style={stagger(320)}
            >
              {TRUST.map((t, i) => (
                <li key={t} className="flex items-center gap-3">
                  {i > 0 && <span aria-hidden="true" className="hidden h-1 w-1 rounded-full bg-muted-foreground/60 sm:block" />}
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-4 md:col-span-12 lg:col-span-5 lg:col-start-8">
            <ClearancePrinter className="float-idle" />
          </div>
        </div>
      </div>
    </section>
  );
};
