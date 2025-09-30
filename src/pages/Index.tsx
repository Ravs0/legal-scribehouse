import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Clock, User } from 'lucide-react';
import { useBlogStore } from '@/stores/blogStore';
import { LEGAL_CATEGORIES } from '@/types/blog';

const Index = () => {
  const { content, authors, fetchContent, fetchAuthors } = useBlogStore();
  
  useEffect(() => {
    fetchContent();
    fetchAuthors();
  }, [fetchContent, fetchAuthors]);

  const allContent = content.filter(item => !item.draft);
  const featuredPost = allContent[0];
  const mainPosts = allContent.slice(1, 4);
  const sidebarPosts = allContent.slice(4, 10);

  return (
    <div className="container py-8">
      {/* Hero Section */}
      <section className="text-center py-12 mb-12">
        <h1 className="text-6xl font-bold mb-4 tracking-tight">
          cicero's scribe
        </h1>
        <p className="text-xl text-muted-foreground italic">then there was law</p>
      </section>

      {/* Magazine Layout */}
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {/* Featured Article */}
          {featuredPost && (
            <article className="mb-12 border-b pb-8">
              <Link to={`/posts/${featuredPost.id}`} className="group">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {featuredPost.categories.slice(0, 2).map(cat => {
                      const category = LEGAL_CATEGORIES.find(c => c.id === cat);
                      return category ? (
                        <Badge key={cat} variant="outline" className="text-xs uppercase tracking-wide">
                          {category.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                  <h2 className="text-4xl font-bold leading-tight group-hover:text-primary transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {featuredPost.summary}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>
                        {featuredPost.authors.length > 0 && authors.find(a => a.id === featuredPost.authors[0])?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(featuredPost.created_at).toLocaleDateString()}</span>
                    </div>
                    <span>{featuredPost.reading_time} min read</span>
                  </div>
                </div>
              </Link>
            </article>
          )}

          {/* Main Articles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainPosts.map((post) => (
              <article key={post.id} className="group">
                <Link to={`/posts/${post.id}`}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      {post.categories.slice(0, 1).map(cat => {
                        const category = LEGAL_CATEGORIES.find(c => c.id === cat);
                        return category ? (
                          <Badge key={cat} variant="secondary" className="text-xs">
                            {category.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                    <h3 className="text-xl font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {post.summary}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>
                        {post.authors.length > 0 && authors.find(a => a.id === post.authors[0])?.name}
                      </span>
                      <span>•</span>
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-8">
            {/* Latest Updates */}
            <div>
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">Latest Updates</h3>
              <div className="space-y-4">
                {sidebarPosts.map((post) => (
                  <article key={post.id} className="group">
                    <Link to={`/posts/${post.id}`}>
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium leading-tight group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{new Date(post.created_at).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{post.reading_time}min</span>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">Practice Areas</h3>
              <div className="space-y-2">
                {LEGAL_CATEGORIES.slice(0, 8).map((category) => (
                  <Link 
                    key={category.id} 
                    to={`/categories/${category.slug}`}
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span>{category.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {content.filter(item => item.categories.includes(category.id) && !item.draft).length}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Featured Authors */}
            <div>
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">Contributors</h3>
              <div className="space-y-3">
                {authors.slice(0, 3).map((author) => (
                  <div key={author.id} className="text-sm">
                    <div className="font-medium">{author.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {content.filter(item => item.authors.includes(author.id) && !item.draft).length} articles
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;