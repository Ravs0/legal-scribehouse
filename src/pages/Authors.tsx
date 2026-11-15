import { SectionHeading } from '@/components/site/SectionHeading';
import { CtaBand } from '@/components/site/CtaBand';
import { Reveal } from '@/components/motion/Reveal';
import { useInsights } from '@/hooks/useInsights';

const Authors = () => {
  const { authors, items, ready } = useInsights();
  return (
    <>
      <section className="container pb-16 pt-12 md:pb-24 md:pt-16">
        <SectionHeading as="h1" eyebrow="Insights" title="The people behind the guides." />
        {ready && authors.length === 0 && (
          <p className="type-body-lg mt-8 text-muted-foreground">Author profiles are coming soon.</p>
        )}
        <ul className="after-heading stack-gap grid sm:grid-cols-2 lg:grid-cols-3">
          {authors.map((a, i) => (
            <Reveal as="li" key={a.id} index={i} className="glass-subtle card-pad rounded-lg">
              <div className="flex items-center gap-4">
                <span className="type-title-sm flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-tertiary-container text-tertiary-on-container">
                  {a.name
                    .split(' ')
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join('')}
                </span>
                <div>
                  <h2 className="type-title-md font-sans">{a.name}</h2>
                  <p className="type-body-sm text-muted-foreground">
                    {items.filter((c) => c.authors.includes(a.id)).length} articles
                  </p>
                </div>
              </div>
              {a.bio && <p className="type-body-sm mt-4 text-muted-foreground">{a.bio}</p>}
            </Reveal>
          ))}
        </ul>
      </section>
      <CtaBand />
    </>
  );
};
export default Authors;
