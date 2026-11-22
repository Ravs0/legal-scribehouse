import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import '@/styles/polish-pages.css';
import { Reveal } from '@/components/motion/Reveal';
import { CardFooter, CardHeader } from '@/components/site/CardHeader';
import { CtaBand } from '@/components/site/CtaBand';
import { SectionHeading } from '@/components/site/SectionHeading';
import { PostCard } from '@/components/Blog/PostCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SERVICES } from '@/data/services';
import { SERVICE_DETAILS } from '@/data/serviceDetails';
import { useInsights } from '@/hooks/useInsights';
import NotFound from './NotFound';

const bySlug = (slug?: string) => SERVICES.find((s) => SERVICE_DETAILS[s.id]?.slug === slug);

/** /services: all six, each linking to its page. */
const ServicesPage = () => (
  <>
    <section className="container pg-top">
      <SectionHeading as="h1" index="—" eyebrow="Services" title="Six jobs we take off your desk." subtitle="Each one is a fixed-fee job with a defined deliverable. Hire us for one, or for the whole route." />
      <ul className="after-heading stack-gap grid sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s, i) => {
          const d = SERVICE_DETAILS[s.id];
          return (
            <Reveal as="li" key={s.id} index={i}>
              <Link to={`/services/${d.slug}`} className="surface-1 card-hover card-shell pg-card group h-full rounded-[12px]">
                <CardHeader icon={s.icon} title={s.title} />
                <p className="card-body type-body-md text-muted-foreground">{s.copy}</p>
                <CardFooter className="flex items-center justify-between gap-2">
                  <span className="type-label-sm text-muted-foreground">{d.timeline}</span>
                  <span className="type-label-md inline-flex items-center gap-1 text-primary-ink">Details <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" /></span>
                </CardFooter>
              </Link>
            </Reveal>
          );
        })}
      </ul>
    </section>
    <CtaBand />
  </>
);

/** /services/:slug: what it is, who it's for, how it runs, what you get, related insights. */
export const ServiceDetail = () => {
  const { slug } = useParams();
  const s = bySlug(slug);
  const { items } = useInsights();
  if (!s) return <NotFound />;
  const d = SERVICE_DETAILS[s.id];
  const related = items.filter((a) => a.categories.includes(d.topic)).slice(0, 3);
  const Icon = s.icon;

  return (
    <>
      <section className="container pg-top">
        <Button asChild variant="ghost" size="sm" className="-ml-3">
          <Link to="/services"><ArrowLeft aria-hidden="true" /> All services</Link>
        </Button>
        <div className="grid-12 mt-6 items-start gap-y-8">
          <div className="col-span-4 md:col-span-12 lg:col-span-7">
            <span className="icon-well inline-flex h-12 w-12 items-center justify-center rounded-[12px] text-primary-ink"><Icon className="h-6 w-6" aria-hidden="true" /></span>
            <h1 className="type-hero pg-title mt-5">{s.title}</h1>
            <p className="type-body-lg pg-lede mt-5 text-muted-foreground">{d.intro}</p>
          </div>
          <aside className="surface-2 col-span-4 rounded-[14px] p-5 md:col-span-12 md:p-6 lg:col-span-4 lg:col-start-9 lg:mt-4">
            <p className="type-label-md text-muted-foreground">You get</p>
            <ul className="mt-3 space-y-2.5">
              {d.youGet.map((g) => (
                <li key={g} className="type-body-md flex gap-2.5"><Check className="mt-1 h-4 w-4 shrink-0 text-success" aria-hidden="true" />{g}</li>
              ))}
            </ul>
            <dl className="type-body-sm mt-5 space-y-2 border-t border-border pt-4">
              <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Timeline</dt><dd className="text-right">{d.timeline}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Fee</dt><dd className="text-right">Fixed, quoted after a free call</dd></div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="section band">
        <div className="container">
          <SectionHeading index="01" eyebrow="How it runs" title="Three steps, one fixed fee." />
          <ol className="after-heading stack-gap grid md:grid-cols-3">
            {d.steps.map((st, i) => (
              <Reveal as="li" key={st.title} index={i} className="surface-1 h-full rounded-[12px] p-5 md:p-6">
                <span className="sh-num text-[36px]">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="type-title-lg mt-3">{st.title}</h3>
                <p className="type-body-md mt-2 text-muted-foreground">{st.copy}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading index="02" eyebrow="Who it's for" title="Usually the right fit if you are…" />
          <ul className="after-heading grid gap-x-6 gap-y-4 md:grid-cols-3">
            {d.forWho.map((f) => (
              <li key={f} className="type-body-lg flex gap-3 border-t border-border pt-4"><span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />{f}</li>
            ))}
          </ul>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section pt-0">
          <div className="container">
            <SectionHeading index="03" eyebrow="Read first" title="Guides on this topic." />
            <ul className={`after-heading stack-gap grid ${related.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
              {related.map((p) => <li key={p.id}><PostCard post={p} /></li>)}
            </ul>
          </div>
        </section>
      )}
      <div className="container pb-8"><Badge variant="warning" className="h-auto max-w-full whitespace-normal py-1">Timelines and inclusions are placeholders until confirmed by the firm</Badge></div>
      <CtaBand />
    </>
  );
};

export default ServicesPage;
