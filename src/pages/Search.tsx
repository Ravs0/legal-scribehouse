import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search as SearchIcon, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBlogStore } from '@/stores/blogStore';
import { LEGAL_CATEGORIES } from '@/types/blog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Search = () => {
  const { searchContent, content, authors } = useBlogStore();
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    
    let results = searchContent(query);
    
    if (typeFilter !== 'all') {
      results = results.filter(item => item.type === typeFilter);
    }
    
    if (categoryFilter !== 'all') {
      results = results.filter(item => item.categories.includes(categoryFilter));
    }
    
    return results;
  }, [query, typeFilter, categoryFilter, searchContent]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is reactive, no need for explicit submit
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Search Legal Content</h1>
        <p className="text-lg text-muted-foreground">
          Search through our comprehensive legal database
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for legal topics, cases, statutes..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">
              Search
            </Button>
          </div>

          <div className="flex gap-4 items-center">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Content Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="post">Analysis</SelectItem>
                <SelectItem value="case">Cases</SelectItem>
                <SelectItem value="statute">Statutes</SelectItem>
                <SelectItem value="guide">Guides</SelectItem>
                <SelectItem value="briefing">Briefings</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {LEGAL_CATEGORIES.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </form>

        {query && (
          <div className="mb-6">
            <p className="text-muted-foreground">
              {searchResults.length === 0 
                ? `No results found for "${query}"` 
                : `Found ${searchResults.length} result${searchResults.length === 1 ? '' : 's'} for "${query}"`
              }
            </p>
          </div>
        )}

        <div className="grid gap-6">
          {searchResults.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="capitalize">{item.type}</Badge>
                  {item.categories.slice(0, 2).map(cat => {
                    const category = LEGAL_CATEGORIES.find(c => c.id === cat);
                    return category ? (
                      <Badge key={cat} variant="secondary" className="text-xs">
                        {category.name}
                      </Badge>
                    ) : null;
                  })}
                </div>
                <CardTitle className="text-xl">
                  <Link to={`/posts/${item.id}`} className="hover:text-primary">
                    {item.title}
                  </Link>
                </CardTitle>
                <CardDescription>
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
                <div className="flex flex-wrap gap-1 mt-3">
                  {item.tags.slice(0, 4).map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!query && (
          <div className="text-center py-12">
            <SearchIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Start Searching</h3>
            <p className="text-muted-foreground">
              Enter keywords to search through our legal content database
            </p>
            <div className="mt-6">
              <h4 className="font-medium mb-3">Browse by Category:</h4>
              <div className="flex flex-wrap gap-2 justify-center">
                {LEGAL_CATEGORIES.slice(0, 6).map(category => (
                  <Button key={category.id} variant="outline" size="sm" asChild>
                    <Link to={`/categories/${category.slug}`}>
                      {category.name}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;