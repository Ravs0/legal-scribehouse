import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, FileQuestion, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IconContainer } from '@/components/ui/chip';
import { Skeleton } from '@/components/ui/skeleton';
import { PostCard } from '@/components/Blog/PostCard';
import { formatDate, TYPE_META } from '@/lib/insights';
import { CtaBand } from '@/components/site/CtaBand';
import { useInsights } from '@/hooks/useInsights';

interface TocItem {
  id: string;
  text: string;
}

/** Adds ids to h2s in the post HTML and returns a table of contents. */
function withToc(html: string): { html: string; toc: TocItem[] } {
  if (typeof DOMParser === 'undefined') return { html, toc: [] };
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html');
  const toc: TocItem[] = [];
  doc.querySelectorAll('h2').forEach((h, i) => {
    const id = h.id || `section-${i + 1}`;
    h.id = id;
    toc.push({ id, text: h.textContent ?? `Section ${i + 1}` });
  });
  return { html: doc.body.firstElementChild?.innerHTML ?? html, toc };
}

const PostDetail = () => {
  const { id } = useParams();
  const { items, authors, ready } = useInsights();
  const post = items.find((p) => p.id === id);
  const [activeId, setActiveId] = useState<string | null>(null);

  const { html, toc } = useMemo(() => withToc(post?.content ?? ''), [post?.content]);
  const related = useMemo(
    () => (post ? items.filter((p) => p.id !== post.id && p.type === post.type).slice(0, 3) : []),
    [items, post],
  );

  useEffect(() => {
    if (!toc.length || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActiveId(e.target.id)),
      { rootMargin: '-120px 0px -70% 0px' },
    );
    toc.forEach((t) => {
      const el = document.getElementById(t.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [toc]);

  if (!ready && !post) {
    return (
      <div className="container py-16">
        <div className="mx-auto max-w-3xl space-y-6">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container flex min-h-[60svh] flex-col items-center justify-center py-16 text-center">
        <IconContainer icon={FileQuestion} className="h-14 w-14" />
        <h1 className="type-headline-md mt-6">We couldn't find that article.</h1>
        <p className="type-body-md mt-2 text-muted-foreground">It may have moved or been unpublished.</p>
        <Button asChild variant="ghost" icon="leading" className="mt-6">
          <Link to="/insights">
            <ArrowLeft aria-hidden="true" /> Back to insights
          </Link>
        </Button>
      </div>
    );
  }

  const meta = TYPE_META[post.type] ?? TYPE_META.post;
  const author = authors.find((a) => post.authors.includes(a.id));

  return (
    <>
      <article className="container pb-16 pt-10 md:pb-24 md:pt-14">
        <div className="grid-12">
          <div className="col-span-4 md:col-span-12 lg:col-span-8 lg:col-start-3">
            <Button asChild variant="ghost" icon="leading" className="-ml-3">
              <Link to="/insights">
                <ArrowLeft aria-hidden="true" /> Back to insights
              </Link>
            </Button>
            <Badge className="mt-6">{meta.label}</Badge>
            <h1 className="type-display-md mt-4 max-w-[20ch]">{post.title}</h1>
            <div className="mt-6 flex items-center gap-3">
              {author && (
                <span className="type-label-md flex h-10 w-10 items-center justify-center rounded-full bg-tertiary-container text-tertiary-on-container">
                  {author.name
                    .split(' ')
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join('')}
                </span>
              )}
              <div>
                {author && <p className="type-label-lg">{author.name}</p>}
                <p className="type-body-sm text-muted-foreground">
                  {formatDate(post.created_at)}
                  {post.reading_time ? ` · ${post.reading_time} min read` : ''}
                </p>
              </div>
            </div>

            {post.summary && <p className="type-body-lg mt-10 max-w-[68ch] text-muted-foreground">{post.summary}</p>}

            <div
              className="prose-tidewater mt-8 max-w-[68ch]"
              // Content is authored by the firm in the CMS.
              dangerouslySetInnerHTML={{ __html: html }}
            />

            <div className="mt-12 flex gap-3 rounded-lg border border-outline-variant p-5">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <p className="type-body-sm text-muted-foreground">
                This article is general information, current at the date of publication. It is not legal advice; rules
                change and depend on your product and route.
              </p>
            </div>
          </div>

          {toc.length > 1 && (
            <aside className="hidden xl:col-span-2 xl:col-start-11 xl:row-start-1 xl:block">
              <nav aria-label="On this page" className="glass sticky top-[120px] rounded-lg p-4">
                <p className="type-label-md text-muted-foreground">On this page</p>
                <ul className="mt-3 space-y-1">
                  {toc.map((t) => (
                    <li key={t.id}>
                      <a
                        href={`#${t.id}`}
                        className={
                          activeId === t.id
                            ? 'type-label-md block border-l-2 border-primary py-1 pl-3 text-primary'
                            : 'type-label-md block border-l-2 border-transparent py-1 pl-3 text-muted-foreground hover:text-foreground'
                        }
                      >
                        {t.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          )}
        </div>

        {related.length > 0 && (
          <section className="mt-16 md:mt-24">
            <h2 className="type-headline-md">Keep reading</h2>
            <ul className="after-heading stack-gap grid sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <li key={p.id}>
                  <PostCard post={p} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
      <CtaBand />
    </>
  );
};

export default PostDetail;
