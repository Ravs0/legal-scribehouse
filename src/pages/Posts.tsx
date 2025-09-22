import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CalendarDays, User, ArrowRight } from 'lucide-react';
import { useBlogStore } from '@/stores/blogStore';
import { LEGAL_CATEGORIES } from '@/types/blog';

const Posts = () => {
  const { getContentByType, authors } = useBlogStore();
  const posts = getContentByType('post');

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Legal Analysis & Commentary</h1>
        <p className="text-lg text-muted-foreground">
          In-depth analysis, opinion pieces, and commentary on current legal developments
        </p>
      </div>

      <div className="grid gap-6">
        {posts.map((post) => (
          <Card key={post.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline">Analysis</Badge>
                {post.categories.slice(0, 3).map(cat => {
                  const category = LEGAL_CATEGORIES.find(c => c.id === cat);
                  return category ? (
                    <Link key={cat} to={`/categories/${category.slug}`}>
                      <Badge variant="secondary" className="hover:bg-accent">
                        {category.name}
                      </Badge>
                    </Link>
                  ) : null;
                })}
              </div>
              
              <CardTitle className="text-2xl mb-2">
                <Link to={`/post/${post.slug}`} className="hover:text-primary">
                  {post.title}
                </Link>
              </CardTitle>
              
              <CardDescription className="text-base">
                {post.summary}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <CalendarDays className="h-4 w-4" />
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  {post.authors.length > 0 && (
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {post.authors.map(authorId => {
                        const author = authors.find(a => a.id === authorId);
                        return author ? author.name : null;
                      }).filter(Boolean).join(', ')}
                    </div>
                  )}
                </div>
                
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/post/${post.slug}`}>
                    Read More <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-3">
                {post.tags.slice(0, 4).map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {posts.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No posts available yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Posts;