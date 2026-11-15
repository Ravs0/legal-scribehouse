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
  <div aria-hidden="true" className={cn('bezel-well overflow-hidden rounded-[14px] p-1', className)}>
    <div className="h-full w-full overflow-hidden rounded-[10px]">
      <MarketScene scene={SCENES[TYPE_SCENE[type] ?? 'SG']} />
    </div>
  </div>
);

export const PostCard = ({ post }: { post: ContentItem }) => {
  const meta = TYPE_META[post.type] ?? TYPE_META.post;
  return (
    <Link
      to={`/posts/${post.id}`}
     
      className="surface-1 card-hover group flex h-full flex-col rounded-[20px] p-2.5"
    >
      <GradientTile type={post.type} className="aspect-video" />
      <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
        <Badge className="self-start">{meta.label}</Badge>
        <h3 className="type-title-lg mt-2.5 line-clamp-3">{post.title}</h3>
        <p className="type-body-sm mt-2 line-clamp-3 flex-1 text-muted-foreground">{post.summary}</p>
        <div className="type-label-sm mt-4 flex items-center justify-between text-muted-foreground">
          <span>
            <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
            {post.reading_time ? ` · ${post.reading_time} min read` : ''}
          </span>
          <ArrowUpRight
            className="h-4 w-4 text-primary-ink transition-transform duration-short4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </div>
      </div>
    </Link>
  );
};
