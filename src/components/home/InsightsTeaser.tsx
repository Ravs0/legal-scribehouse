import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Reveal } from '@/components/motion/Reveal';
import { SectionLabel } from '@/components/site/SectionLabel';
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

  return (
    <section className="border-y border-border bg-card/50 py-20 md:py-28">
      <div className="container">
        <SectionLabel index="08" label="FROM THE DESK" />
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Reveal>
            <h2 className="text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
              From the <em className="font-medium text-accent">desk</em>.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">Guides and briefings on exporting to ASEAN.</p>
          </Reveal>
          <Button asChild variant="outline" className="arrow-nudge rounded-sm bg-transparent font-mono">
            <Link to="/insights">
              All insights <span className="arrow">-&gt;</span>
            </Link>
          </Button>
        </div>

        {!ready ? (
          <div className="mt-12 grid gap-6 md:grid-cols-3" aria-busy="true" aria-label="Loading insights">
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-3 border border-border bg-background p-6">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : latest.length === 0 ? (
          <p className="mt-12 border border-dashed border-rule p-6 font-mono text-sm text-muted-foreground">
            &gt; Insights coming soon<span className="blink text-accent">_</span>
          </p>
        ) : (
          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {latest.map((post, i) => (
              <Reveal as="li" key={post.id} index={i}>
                <Link
                  to={`/posts/${post.id}`}
                  className="hard-hover flex h-full flex-col border border-border bg-background p-6"
                >
                  <div className="label-mono flex justify-between text-muted-foreground">
                    <time dateTime={post.created_at}>
                      {new Date(post.created_at).toLocaleDateString(undefined, {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </time>
                    {post.reading_time ? <span>{post.reading_time} min</span> : null}
                  </div>
                  <h3 className="mt-4 text-xl font-semibold leading-snug">{post.title}</h3>
                  <p className="mt-2 line-clamp-2 text-muted-foreground">{post.summary}</p>
                </Link>
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};
