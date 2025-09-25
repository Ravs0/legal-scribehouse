import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, BookOpen, Scale, FileText, Briefcase, Users } from 'lucide-react';
import { useBlogStore } from '@/stores/blogStore';
import { LEGAL_CATEGORIES } from '@/types/blog';

const Index = () => {
  const { content, authors } = useBlogStore();
  const recentContent = content.filter(item => !item.draft).slice(0, 6);

  return (
    <div className="container py-8">
      {/* Hero Section */}
      <section className="text-center py-16 mb-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">
            cicero's scribe
          </h1>
          <p className="text-xl text-muted-foreground mb-2">then there was law</p>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Comprehensive legal analysis, case digests, and insights across multiple jurisdictions. 
            Where legal scholarship meets practical application.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild size="lg">
              <Link to="/posts">
                <BookOpen className="mr-2 h-4 w-4" />
                Latest Analysis
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/search">
                <Scale className="mr-2 h-4 w-4" />
                Search Archive
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Browse by Content Type</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Analysis & Opinion', path: '/posts', icon: BookOpen, description: 'In-depth legal analysis and commentary' },
            { title: 'Case Digests', path: '/cases', icon: Scale, description: 'Court decisions and tribunal rulings' },
            { title: 'Statute Notes', path: '/statutes', icon: FileText, description: 'Legislative analysis and interpretation' },
            { title: 'Briefings', path: '/briefings', icon: Briefcase, description: 'Quick updates and developments' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.path} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-2 p-3 rounded-full bg-primary/10 w-fit">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button variant="outline" className="w-full" asChild>
                    <Link to={item.path}>
                      Explore <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Legal Topics */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Legal Practice Areas</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {LEGAL_CATEGORIES.map((category) => (
            <Card key={category.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <Link to={`/categories/${category.slug}`} className="block">
                  <h3 className="font-semibold mb-2">{category.name}</h3>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                      {content.filter(item => item.categories.includes(category.id) && !item.draft).length} articles
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Content */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Recent Publications</h2>
          <Button variant="outline" asChild>
            <Link to="/posts">View All</Link>
          </Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentContent.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{item.type}</Badge>
                  {item.categories.slice(0, 2).map(cat => {
                    const category = LEGAL_CATEGORIES.find(c => c.id === cat);
                    return category ? (
                      <Badge key={cat} variant="secondary" className="text-xs">
                        {category.name}
                      </Badge>
                    ) : null;
                  })}
                </div>
                <CardTitle className="line-clamp-2">
                  <Link to={`/posts/${item.id}`} className="hover:text-primary">
                    {item.title}
                  </Link>
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {item.summary}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{new Date(item.created_at).toLocaleDateString()}</span>
                  <span>
                    {item.authors.length > 0 && authors.find(a => a.id === item.authors[0])?.name}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Authors */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Our Contributors</h2>
          <Button variant="outline" asChild>
            <Link to="/authors">
              <Users className="mr-2 h-4 w-4" />
              All Authors
            </Link>
          </Button>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {authors.slice(0, 2).map((author) => (
            <Card key={author.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{author.name}</h3>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-3">
                      {author.bio}
                    </p>
                    <Badge variant="outline">
                      {content.filter(item => item.authors.includes(author.id) && !item.draft).length} articles
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;