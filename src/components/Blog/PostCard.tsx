import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { pointerGlow } from '@/hooks/usePointerGlow';
import type { ContentItem } from '@/types/blog';
import { formatDate, TYPE_META } from '@/lib/insights';
import { cn } from '@/lib/utils';

/** Aurora gradient tile with a category icon; stands in for post imagery. */
export const GradientTile = ({ type, className }: { type: ContentItem['type']; className?: string }) => {
  const meta = TYPE_META[type] ?? TYPE_META.post;
  const Icon = meta.icon;
  return (
    <div
      aria-hidden="true"
      className={cn('flex items-center justify-center rounded-md', className)}
      style={{
        background: `linear-gradient(135deg, hsl(var(--aurora-${meta.pair[0]})), hsl(var(--aurora-${meta.pair[1]})))`,
      }}
    >
      <Icon className="h-12 w-12 text-white/90" strokeWidth={1.5} />
    </div>
  );
};

export const PostCard = ({ post }: { post: ContentItem }) => {
  const meta = TYPE_META[post.type] ?? TYPE_META.post;
  return (
    <Link
      to={`/posts/${post.id}`}
      onMouseMove={pointerGlow}
      className="glass-subtle lift-card group flex h-full flex-col rounded-lg p-3"
    >
      <GradientTile type={post.type} className="aspect-video" />
      <div className="flex flex-1 flex-col p-2 pt-5 md:p-3 md:pt-5">
        <Badge className="self-start">{meta.label}</Badge>
        <h3 className="type-title-lg mt-3 line-clamp-3">{post.title}</h3>
        <p className="type-body-sm mt-2 line-clamp-3 flex-1 text-muted-foreground">{post.summary}</p>
        <div className="type-label-sm mt-5 flex items-center justify-between text-muted-foreground">
          <span>
            <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
            {post.reading_time ? ` · ${post.reading_time} min read` : ''}
          </span>
          <ArrowUpRight
            className="h-4 w-4 text-primary transition-transform duration-short4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </div>
      </div>
    </Link>
  );
};
