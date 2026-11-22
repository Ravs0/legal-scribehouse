import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, FileQuestion, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IconContainer } from '@/components/ui/chip';
import { Skeleton } from '@/components/ui/skeleton';
import { PostCard } from '@/components/Blog/PostCard';
import { formatDate, TYPE_META } from '@/lib/insights';
import '@/styles/polish-pages.css';
import { SectionHeading } from '@/components/site/SectionHeading';
import { CtaBand } from '@/components/site/CtaBand';
import { useInsights } from '@/hooks/useInsights';
import { renderArticle } from '@/lib/markdown';

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
  const post = items.find((p) => p.id === id || p.slug === id);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Bodies are Markdown (or legacy HTML); renderArticle escapes and sanitises both before they reach the page.
  const { html, toc } = useMemo(() => withToc(renderArticle(post?.content ?? '')), [post?.content]);
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
  const initials = author?.name.split(' ').map((w) => w[0]).slice(0, 2).join('');

  return (
    <>
      <article className="container pg-top pb-16 md:pb-24">
        <div className="grid-12 gap-y-0">
          <div className="col-span-4 md:col-span-12">
            <Button asChild variant="ghost" size="sm" className="-ml-3">
              <Link to="/insights">
                <ArrowLeft aria-hidden="true" /> Back to insights
              </Link>
            </Button>
          </div>

          <header className="col-span-4 mt-6 md:col-span-12 lg:col-span-9 lg:col-start-4">
            <Badge>{meta.label}</Badge>
            <h1 className="type-display-md article-title mt-4">{post.title}</h1>
            <div className="mt-6 flex items-center gap-3">
              {author && (
                <span className="type-label-md flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-tertiary-container text-tertiary-on-container">
                  {initials}
                </span>
              )}
              <div className="min-w-0">
                {author && <p className="type-label-lg">{author.name}</p>}
                <p className="type-body-sm text-muted-foreground">
                  <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
                  {post.reading_time ? ` · ${post.reading_time} min read` : ''}
                </p>
              </div>
            </div>
            {post.summary && <p className="article-lede mt-8 border-t border-border pt-8">{post.summary}</p>}
          </header>

          {toc.length > 1 && (
            <aside className="mt-12 hidden lg:col-span-3 lg:col-start-1 lg:row-start-3 lg:block">
              <nav aria-label="On this page" className="sticky top-[112px] max-w-[240px] border-t border-border pt-4">
                <p className="type-label-md text-muted-foreground">On this page</p>
                <ul className="mt-3 space-y-0.5">
                  {toc.map((t) => (
                    <li key={t.id}>
                      <a
                        href={`#${t.id}`}
                        aria-current={activeId === t.id ? 'true' : undefined}
                        className={
                          activeId === t.id
                            ? 'toc-link type-label-md block border-l-2 border-primary py-1.5 pl-3 text-primary-ink'
                            : 'toc-link type-label-md block border-l-2 border-transparent py-1.5 pl-3 text-muted-foreground hover:text-foreground'
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

          <div className="col-span-4 mt-10 md:col-span-12 lg:col-span-8 lg:col-start-4 lg:row-start-3 lg:mt-12">
            <div
              className="article-prose"
              // Content is authored by the firm in the CMS.
              dangerouslySetInnerHTML={{ __html: html }}
            />
            <div className="surface-1 mt-12 flex max-w-[65ch] gap-3 rounded-[12px] p-5">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary-ink" aria-hidden="true" />
              <p className="type-body-sm text-muted-foreground">
                This article is general information, current at the date of publication. It is not legal advice; rules
                change and depend on your product and route.
              </p>
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="container pb-16 md:pb-24">
          <SectionHeading eyebrow={meta.label} title="Keep reading" />
          <ul className={`after-heading stack-gap grid sm:grid-cols-2 ${related.length > 2 ? 'lg:grid-cols-3' : ''}`}>
            {related.map((p) => (
              <li key={p.id}>
                <PostCard post={p} />
              </li>
            ))}
          </ul>
        </section>
      )}
      <CtaBand />
    </>
  );
};

export default PostDetail;
