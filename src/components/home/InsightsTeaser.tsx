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

  const allButton = (className: string) => (
    <Button asChild variant="ghost" icon="trailing" className={className}>
      <Link to="/insights">
        All insights <ArrowRight aria-hidden="true" />
      </Link>
    </Button>
  );

  return (
    <section id="insights" className="section">
      <div className="container">
        <div className="grid-12 items-end">
          <SectionHeading
            className="col-span-4 md:col-span-8"
            eyebrow="Insights"
            title="Plain-English guides to ASEAN trade rules."
          />
          {!empty && <div className="col-span-4 hidden justify-end md:flex">{allButton('-mr-3')}</div>}
        </div>

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
                  We're writing plain-English explainers on HS codes, rules of origin and distributor contracts.
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

        {!empty && (
          <Button asChild variant="outline" className="mt-8 w-full md:hidden">
            <Link to="/insights">All insights</Link>
          </Button>
        )}
      </div>
    </section>
  );
};
