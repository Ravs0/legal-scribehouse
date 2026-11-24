import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { ContentItem } from '@/types/blog';
import { formatDate, TYPE_META } from '@/lib/insights';
import { MarketScene, SCENES } from '@/components/site/MarketScene';
import { cn } from '@/lib/utils';

const TYPE_SCENE: Record<ContentItem['type'], string> = { post: 'SG', guide: 'VN', briefing: 'MY', case: 'KH', statute: 'BN' };

/** Recessed well holding a dawn scene; stands in for post imagery. */
export const GradientTile = ({ type, className }: { type: ContentItem['type']; className?: string }) => (
  <div aria-hidden="true" className={cn('bezel-well overflow-hidden rounded-[10px] p-1', className)}>
    <div className="h-full w-full overflow-hidden rounded-[6px]">
      <MarketScene scene={SCENES[TYPE_SCENE[type] ?? 'SG']} />
    </div>
  </div>
);

/** v3.8 card anatomy: image, then title (+ arrow), body, and a pinned footer with the type badge and date. */
export const PostCard = ({ post }: { post: ContentItem }) => {
  const meta = TYPE_META[post.type] ?? TYPE_META.post;
  return (
    <Link to={`/insights/${post.slug ?? post.id}`} className="surface-1 card-hover group flex h-full flex-col rounded-[12px] p-2.5">
      <GradientTile type={post.type} className="aspect-video" />
      <div className="card-shell flex-1 !px-[10px] !pb-[10px] !pt-4">
        <div className="flex items-start gap-3">
          <h3 className="type-title-lg line-clamp-3 min-w-0 flex-1">{post.title}</h3>
          <ArrowUpRight
            className="mt-[5px] h-4 w-4 shrink-0 text-primary-ink transition-transform duration-short4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </div>
        <p className="card-body type-body-md line-clamp-3 text-muted-foreground">{post.summary}</p>
        <div className="card-foot type-label-sm flex items-center justify-between gap-3 text-muted-foreground">
          <Badge>{meta.label}</Badge>
          <span>
            <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
            {post.reading_time ? ` · ${post.reading_time} min read` : ''}
          </span>
        </div>
      </div>
    </Link>
  );
};
