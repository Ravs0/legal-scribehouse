import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Barcode, FileSignature, Stamp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { CardFooter, CardHeader } from '@/components/site/CardHeader';
import { PostCard } from '@/components/Blog/PostCard';
import { Reveal } from '@/components/motion/Reveal';
import { SectionHeading } from '@/components/site/SectionHeading';
import { useBlogStore } from '@/stores/blogStore';

/* Shown until the first posts are published: what's being written, in the shared card anatomy. */
const UPCOMING = [
  {
    icon: Barcode,
    title: 'Finding the right HS code for your destination',
    copy: 'Why the code you use at home can be wrong at the border, and how to check it before you book freight.',
    meta: '6 min',
  },
  {
    icon: Stamp,
    title: 'Rules of origin, without the jargon',
    copy: 'How to tell whether your goods qualify for ATIGA, RCEP or AANZFTA rates, and the paperwork that proves it.',
    meta: '8 min',
  },
  {
    icon: FileSignature,
    title: 'Five clauses to check in a distributor contract',
    copy: 'Exclusivity, minimums, exit, trademark ownership and governing law: what to ask for and what to refuse.',
    meta: '7 min',
  },
];

export const InsightsTeaser = () => {
  const { content, fetchContent } = useBlogStore();
  const [ready, setReady] = useState(content.length > 0);

  useEffect(() => {
    let alive = true;
    fetchContent().finally(() => alive && setReady(true));
    return () => {
      alive = false;
    };
  }, [fetchContent]);

  const latest = content.filter((c) => !c.draft).slice(0, 3);

  return (
    <section id="insights" className="section">
      <div className="container">
        <SectionHeading eyebrow="Insights" title="Plain-English guides to ASEAN trade rules." />

        {!ready ? (
          <div className="after-heading stack-gap grid md:grid-cols-3" aria-busy="true" aria-label="Loading insights">
            {[0, 1, 2].map((i) => (
              <div key={i} className="surface-1 space-y-3 rounded-[20px] p-2.5">
                <Skeleton className="aspect-video w-full rounded-md" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : latest.length === 0 ? (
          <ul className="after-heading stack-gap grid md:grid-cols-3">
            {UPCOMING.map((g, i) => (
              <Reveal as="li" key={g.title} index={i}>
                <article className="surface-1 card-shell h-full rounded-[20px]">
                  <CardHeader icon={g.icon} title={g.title} meta={g.meta} />
                  <p className="card-body type-body-md text-muted-foreground">{g.copy}</p>
                  <CardFooter className="flex items-center justify-between gap-2">
                    <span className="type-label-sm text-muted-foreground">Guide</span>
                    <Badge variant="outline">In progress</Badge>
                  </CardFooter>
                </article>
              </Reveal>
            ))}
          </ul>
        ) : (
          <ul className="after-heading stack-gap grid md:grid-cols-3">
            {latest.map((post, i) => (
              <Reveal as="li" key={post.id} index={i}>
                <PostCard post={post} />
              </Reveal>
            ))}
          </ul>
        )}

        {/* v3.8: one centred "All insights" link under the cards at every size. */}
        {(
          <div className="mt-8 flex justify-center">
            <Button asChild variant="outline" icon="trailing" className="w-full sm:w-auto">
              <Link to="/insights">
                All insights <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
