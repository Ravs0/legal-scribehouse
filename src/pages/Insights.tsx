import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Search, SearchX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FilterChip, IconContainer } from '@/components/ui/chip';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { GradientTile, PostCard } from '@/components/Blog/PostCard';
import { TYPE_META } from '@/lib/insights';
import { Reveal } from '@/components/motion/Reveal';
import { CtaBand } from '@/components/site/CtaBand';
import { SectionHeading } from '@/components/site/SectionHeading';
import { useInsights } from '@/hooks/useInsights';
import type { ContentItem } from '@/types/blog';
import { cn } from '@/lib/utils';

const FILTERS: { to: string; label: string; type?: ContentItem['type'] }[] = [
  { to: '/insights', label: 'All' },
  { to: '/posts', label: 'Analysis', type: 'post' },
  { to: '/guides', label: 'Guides', type: 'guide' },
  { to: '/briefings', label: 'Briefings', type: 'briefing' },
  { to: '/cases', label: 'Cases', type: 'case' },
  { to: '/statutes', label: 'Statutes', type: 'statute' },
];

const PAGE_SIZE = 9;

interface InsightsListingProps {
  title?: string;
  subtitle?: string;
  type?: ContentItem['type'];
  category?: string;
  autoFocusSearch?: boolean;
}

export const InsightsListing = ({
  title = 'Plain-English guides to ASEAN trade rules.',
  subtitle = 'Guides, briefings, case notes and statute notes for small businesses exporting into Southeast Asia.',
  type,
  category,
  autoFocusSearch,
}: InsightsListingProps) => {
  const { items, ready } = useInsights();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocusSearch) searchRef.current?.focus();
  }, [autoFocusSearch]);
  useEffect(() => setPage(0), [query, type, category]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter((i) => !type || i.type === type)
      .filter((i) => !category || i.categories.includes(category))
      .filter(
        (i) =>
          !q ||
          i.title.toLowerCase().includes(q) ||
          i.summary.toLowerCase().includes(q) ||
          i.tags.some((t) => t.toLowerCase().includes(q)),
      )
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [items, type, category, query]);

  const showFeatured = page === 0 && !query && filtered.length > 3;
  const featured = showFeatured ? filtered[0] : null;
  const rest = showFeatured ? filtered.slice(1) : filtered;
  const pages = Math.max(1, Math.ceil(rest.length / PAGE_SIZE));
  const visible = rest.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <>
      <section className="container pb-10 pt-12 md:pt-16">
        <SectionHeading as="h1" eyebrow="Insights" title={title} subtitle={subtitle} />

        <div className="mt-10 flex flex-col-reverse gap-4 md:flex-row md:items-center md:justify-between">
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:-mx-6 sm:px-6 md:mx-0 md:flex-wrap md:px-0">
            {FILTERS.map((f) => (
              <FilterChip key={f.to} selected={f.type === type && !category} onClick={() => navigate(f.to)}>
                {f.label}
              </FilterChip>
            ))}
          </div>
          <div className="relative w-full md:w-[280px]">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              ref={searchRef}
              type="search"
              aria-label="Search insights"
              placeholder="Search insights"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-10 rounded-full pl-10"
            />
          </div>
        </div>
      </section>

      <section className="container pb-16 md:pb-24">
        {!ready ? (
          <div className="stack-gap grid sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="surface-1 space-y-3 rounded-[12px] p-2.5">
                <Skeleton className="aspect-video w-full rounded-md" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="surface-1 flex flex-col items-center rounded-[14px] px-6 py-16 text-center">
            <IconContainer icon={SearchX} className="h-14 w-14" />
            <p className="type-headline-sm mt-5">{query ? 'No matches found.' : 'Nothing published here yet.'}</p>
            <p className="type-body-md mt-2 max-w-[48ch] text-muted-foreground">
              {query
                ? 'Try a broader term, like "origin", "trademark" or a country name.'
                : "We're writing plain-English explainers on HS codes, rules of origin and distributor contracts."}
            </p>
            <Button asChild variant="ghost" className="mt-4">
              {query ? (
                <button type="button" onClick={() => setQuery('')}>
                  Clear search
                </button>
              ) : (
                <Link to="/#contact">Ask us a question instead</Link>
              )}
            </Button>
          </div>
        ) : (
          <>
            {featured && (
              <Reveal className="mb-6 xl:mb-8">
                <Link to={`/posts/${featured.id}`} className="surface-2 card-hover grid-12 items-center rounded-[14px] p-2.5 md:p-3">
                  <div className="order-2 col-span-4 p-3 md:order-1 md:col-span-7 md:p-6">
                    <Badge>{TYPE_META[featured.type]?.label ?? 'Analysis'} · Featured</Badge>
                    <h2 className="type-headline-md mt-4">{featured.title}</h2>
                    <p className="type-body-lg mt-3 line-clamp-3 text-muted-foreground">{featured.summary}</p>
                    <p className="type-label-md mt-5 flex items-center gap-2 text-primary-ink">
                      Read the {TYPE_META[featured.type]?.label.toLowerCase() ?? 'post'} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </p>
                  </div>
                  <GradientTile type={featured.type} className="order-1 col-span-4 aspect-[16/10] md:order-2 md:col-span-5" />
                </Link>
              </Reveal>
            )}
            <ul className="stack-gap grid sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((post, i) => (
                <Reveal as="li" key={post.id} index={i}>
                  <PostCard post={post} />
                </Reveal>
              ))}
            </ul>
            {pages > 1 && (
              <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-2">
                <Button variant="ghost" size="icon" disabled={page === 0} onClick={() => setPage(page - 1)} className="disabled:bg-transparent">
                  <ChevronLeft />
                  <span className="sr-only">Previous page</span>
                </Button>
                {Array.from({ length: pages }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-current={i === page ? 'page' : undefined}
                    onClick={() => setPage(i)}
                    className={cn(
                      'press type-label-md relative h-9 w-9 rounded-full',
                      i === page ? 'btn-filled btn-lift text-primary-foreground' : 'btn-raised btn-lift bg-card text-foreground',
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
                <Button variant="ghost" size="icon" disabled={page >= pages - 1} onClick={() => setPage(page + 1)} className="disabled:bg-transparent">
                  <ChevronRight />
                  <span className="sr-only">Next page</span>
                </Button>
              </nav>
            )}
          </>
        )}
      </section>
      <CtaBand />
    </>
  );
};

const Insights = () => <InsightsListing />;
export default Insights;

