import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { IconContainer } from '@/components/ui/chip';
import { PostCard } from '@/components/Blog/PostCard';
import { Reveal } from '@/components/motion/Reveal';
import { SectionHeading } from '@/components/site/SectionHeading';
import { useBlogStore } from '@/stores/blogStore';

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
  const empty = ready && latest.length === 0;

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
          <Reveal className="after-heading">
            <div className="surface-1 flex flex-col gap-3 rounded-[20px] p-4 sm:flex-row sm:items-center">
              <IconContainer icon={BookOpen} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="type-title-sm">First guides are on the way</p>
                <p className="type-body-sm text-muted-foreground">
                  We're writing explainers on HS codes, rules of origin and distributor contracts.
                </p>
              </div>
              <Button asChild variant="outline" size="sm" className="self-start sm:self-auto">
                <Link to="/insights">Browse insights</Link>
              </Button>
            </div>
          </Reveal>
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
        {!empty && (
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
