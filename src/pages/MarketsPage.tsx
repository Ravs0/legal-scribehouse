import { Link, useParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft, ArrowRight, Landmark } from 'lucide-react';
import '@/styles/polish-pages.css';
import { Reveal } from '@/components/motion/Reveal';
import { CardFooter } from '@/components/site/CardHeader';
import { CtaBand } from '@/components/site/CtaBand';
import { SectionHeading } from '@/components/site/SectionHeading';
import { PostCard } from '@/components/Blog/PostCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MARKETS, MARKETS_REVIEWED } from '@/data/markets';
import { useInsights } from '@/hooks/useInsights';
import NotFound from './NotFound';

const Draft = () => (MARKETS_REVIEWED ? null : <Badge variant="warning">Draft: under review</Badge>);

/** /markets: all ten, each linking to its page. */
const MarketsPage = () => (
  <>
    <section className="container pg-top">
      <SectionHeading as="h1" eyebrow="Markets" title="Ten markets. Ten rulebooks." subtitle="Who regulates what, where exporters usually get stuck, and which trade agreements apply.">
        <div className="mt-4"><Draft /></div>
      </SectionHeading>
      <ul className="after-heading stack-gap grid sm:grid-cols-2 lg:grid-cols-3">
        {MARKETS.map((m, i) => (
          <Reveal as="li" key={m.code} index={i}>
            <Link to={`/markets/${m.code.toLowerCase()}`} className="surface-1 card-hover card-shell pg-card group h-full rounded-[12px]">
              <span className="type-mono-sm text-muted-foreground">{m.code}</span>
              <span className="type-title-lg mt-1">{m.name}</span>
              <span className="type-body-md mt-2 text-muted-foreground">{m.tagline}</span>
              <CardFooter className="mt-4 flex items-center justify-between">
                <span className="type-label-md inline-flex items-center gap-1 text-primary-ink">Market guide <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" /></span>
              </CardFooter>
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
    <CtaBand />
  </>
);

/** /markets/:code */
export const MarketDetail = () => {
  const { code = '' } = useParams();
  const m = MARKETS.find((x) => x.code.toLowerCase() === code.toLowerCase());
  const { items } = useInsights();
  if (!m) return <NotFound />;
  const related = items.filter((a) => (a as { markets?: string[] }).markets?.includes(m.code)).slice(0, 3);
  return (
    <>
      <section className="container pg-top">
        <Button asChild variant="ghost" size="sm" className="-ml-3">
          <Link to="/markets"><ArrowLeft aria-hidden="true" /> All markets</Link>
        </Button>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="type-mono-md text-muted-foreground">{m.code}</span>
          <Draft />
        </div>
        <h1 className="type-hero pg-title mt-3">{m.name}</h1>
        <p className="type-body-lg pg-lede mt-5 text-muted-foreground">{m.snapshot}</p>

        <div className="mt-10 grid gap-4 md:grid-cols-3 md:gap-5 md:mt-12">
          <div className="surface-1 rounded-[12px] p-5 md:p-6">
            <h2 className="type-label-md text-muted-foreground">Regulators</h2>
            <ul className="mt-3 space-y-2.5">{m.regulators.map((r) => <li key={r} className="type-body-md flex items-start gap-2.5"><Landmark className="mt-1 h-4 w-4 shrink-0 text-primary-ink" aria-hidden="true" />{r}</li>)}</ul>
          </div>
          <div className="surface-1 rounded-[12px] p-5 md:p-6">
            <h2 className="type-label-md text-muted-foreground">Typical hurdles</h2>
            <ul className="mt-3 space-y-2.5">{m.hurdles.map((h) => <li key={h} className="type-body-md flex items-start gap-2.5"><AlertCircle className="mt-1 h-4 w-4 shrink-0 text-primary-ink" aria-hidden="true" />{h}</li>)}</ul>
          </div>
          <div className="surface-1 rounded-[12px] p-5 md:p-6">
            <h2 className="type-label-md text-muted-foreground">Trade agreements</h2>
            <div className="mt-3 flex flex-wrap gap-1.5">{m.agreements.map((a) => <Badge key={a} variant="tertiary">{a}</Badge>)}</div>
            <p className="type-body-sm mt-4 text-muted-foreground">Whether a rate applies depends on your product's tariff line and origin.</p>
          </div>
        </div>
        <p className="type-label-sm mt-6 text-muted-foreground">General information, not legal advice. Rules change and vary by product.</p>
      </section>
      {related.length > 0 && (
        <section className="section band">
          <div className="container">
            <SectionHeading index="01" eyebrow="Read first" title={`Guides for ${m.name}.`} />
            <ul className={`after-heading stack-gap grid ${related.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>{related.map((p) => <li key={p.id}><PostCard post={p} /></li>)}</ul>
          </div>
        </section>
      )}
      <div className="pt-8 md:pt-12" />
      <CtaBand />
    </>
  );
};

export default MarketsPage;
