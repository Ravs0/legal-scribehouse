import { Button } from '@/components/ui/button';
import { AsciiSeaChart } from '@/components/site/AsciiSeaChart';
import { HashLink } from '@/components/site/HashLink';
import { SectionLabel } from '@/components/site/SectionLabel';
import { ScrambleText } from '@/components/motion/ScrambleText';
import { Ticker } from '@/components/motion/Ticker';

const TICKER_ITEMS = [
  'ATIGA · Form D',
  'RCEP · Cumulation',
  'CPTPP · SG MY VN BN',
  'Incoterms 2020 · FCA CIF DAP DDP',
  'HS 2022',
  'SIAC · AIAC · VIAC',
  'Halal · BPJPH · JAKIM · MUIS',
  'Madrid Protocol',
];

export const Hero = () => (
  <section className="relative overflow-hidden border-b border-border">
    <div aria-hidden="true" className="dot-grid pointer-events-none absolute inset-0" />
    <div className="container relative grid gap-12 py-14 md:py-20 lg:grid-cols-12 lg:items-center lg:gap-10">
      <div className="lg:col-span-5">
        <SectionLabel index="01" label="EXPORT COUNSEL · ASEAN" />
        <h1 className="text-[clamp(2.25rem,6vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.02em] lg:text-[clamp(2.5rem,4.4vw,4.25rem)]">
          Sell into Southeast Asia without the legal{' '}
          <em className="font-medium text-accent">
            <ScrambleText text="guesswork" />
          </em>
          .
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground">
          We help small exporters pick the right market-entry structure, get products registered, claim the tariff
          savings they're entitled to, and sign contracts that hold up, across ASEAN.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button asChild size="lg" className="arrow-nudge h-12 rounded-sm px-6 text-base">
            <HashLink to="contact">
              Book a free 30-minute consult <span className="arrow font-mono">-&gt;</span>
            </HashLink>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 rounded-sm bg-transparent px-6 text-base">
            <HashLink to="check">Take the 2-minute readiness check</HashLink>
          </Button>
        </div>
        <ul className="label-mono mt-8 flex flex-wrap gap-x-5 gap-y-2 text-muted-foreground">
          {['Fixed-fee scopes', 'Plain-English advice', 'Local counsel network'].map((item) => (
            <li key={item}>
              <span aria-hidden="true" className="mr-1.5 text-accent">
                +
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="min-w-0 lg:col-span-7">
        <AsciiSeaChart />
      </div>
    </div>
    <Ticker items={TICKER_ITEMS} className="relative border-t border-border bg-card text-muted-foreground" />
  </section>
);
