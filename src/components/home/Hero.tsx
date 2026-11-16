import { AlertTriangle, ArrowRight, FileX, PackageX, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AssistChip, IconContainer } from '@/components/ui/chip';
import { HashLink } from '@/components/site/HashLink';
import { Eyebrow } from '@/components/site/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { ClearancePrinter } from '@/components/home/ClearancePrinter';

const STATS = [
  { n: '10', label: 'ASEAN markets' },
  { n: '6', label: 'advisory services' },
  { n: '2-min', label: 'readiness check' },
];

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

const stagger = (ms: number) => ({ animationDelay: `${ms}ms` });

export const Hero = () => {
  return (
    <section className="pb-8 pt-6 lg:pb-12 lg:pt-10">
      <div className="container">
        <div className="grid-12 items-center gap-y-8">
          <div className="col-span-4 md:col-span-12 lg:col-span-7">
            <div className="animate-fade-up" style={stagger(0)}>
              <AssistChip icon={Sparkles}>Export legal advisory · ASEAN</AssistChip>
            </div>
            <h1 className="type-display-lg mt-4 max-w-[16ch] animate-fade-up" style={stagger(80)}>
              Sell into Southeast Asia<span className="-ml-[0.07em]">.</span>{' '}
              <span className="text-gradient">
                Skip the legal surprises<span className="-ml-[0.07em]">.</span>
              </span>
            </h1>
            <p className="type-body-lg mt-4 max-w-[52ch] animate-fade-up text-muted-foreground" style={stagger(160)}>
              Structure, contracts, customs and product registration, sorted before your first shipment leaves. Built
              for small exporters, explained in plain English.
            </p>
            <div className="mt-6 flex animate-fade-up flex-col gap-3 sm:flex-row" style={stagger(240)}>
              <Button asChild size="lg" className="w-full sm:w-auto">
                <HashLink to="contact">
                  Book a consult <ArrowRight aria-hidden="true" />
                </HashLink>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                <HashLink to="readiness">Check my readiness</HashLink>
              </Button>
            </div>
            <ul className="mt-6 flex animate-fade-up flex-wrap gap-2" style={stagger(320)}>
              {STATS.map((s) => (
                <li key={s.label} className="surface-1 type-label-md inline-flex h-8 items-center gap-2 rounded-full px-3">
                  <span className="font-bold text-primary-ink tabular">{s.n}</span>
                  <span>{s.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-4 md:col-span-12 lg:col-span-5">
            <ClearancePrinter className="float-idle" />
          </div>
        </div>

        <Reveal className="mt-8 lg:mt-10">
          <div id="problems" className="surface-2 rounded-[24px]">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 pt-4 md:px-5">
              <Eyebrow>Why exports stall</Eyebrow>
              <h2 className="type-label-sm font-sans text-muted-foreground">Three problems that stop a first shipment</h2>
            </div>
            <ul className="mt-1 grid divide-y divide-outline-variant md:grid-cols-3 md:divide-x md:divide-y-0">
              {PROBLEMS.map((p) => (
                <li key={p.title} className="flex items-start gap-3 p-4 md:p-5">
                  <IconContainer icon={p.icon} size="sm" tone="destructive" />
                  <div className="min-w-0">
                    <h3 className="type-title-sm">{p.title}</h3>
                    <p className="type-body-sm mt-0.5 text-muted-foreground">{p.copy}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
