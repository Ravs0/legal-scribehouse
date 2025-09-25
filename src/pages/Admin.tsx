import { useState, useEffect } from 'react';
import { ContentItem, Author } from '@/types/blog';
import { useBlogStore } from '@/stores/blogStore';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Edit3, PlusCircle, BookOpen, FileText, Scale, Map, Briefcase, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('overview');
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);
  const { content, authors, addContent, updateContent, deleteContent, addAuthor, updateAuthor, deleteAuthor, fetchContent, fetchAuthors, loading } = useBlogStore();
  const { signOut } = useAuth();
  const { toast } = useToast();

  const [newContent, setNewContent] = useState({
    type: 'post' as ContentItem['type'],
    title: '',
    summary: '',
    categories: [] as string[],
    tags: [] as string[],
    content: '',
    authors: [] as string[],
    draft: true,
  });

  const [newAuthor, setNewAuthor] = useState({
    name: '',
    email: '',
    bio: '',
  });

  useEffect(() => {
    fetchContent();
    fetchAuthors();
  }, [fetchContent, fetchAuthors]);

  const handleCreateContent = async () => {
    try {
      await addContent({
        ...newContent,
        reading_time: Math.ceil(newContent.content.split(' ').length / 200),
      });

      setNewContent({
        type: 'post',
        title: '',
        summary: '',
        categories: [],
        tags: [],
        content: '',
        authors: [],
        draft: true,
      });

      toast({
        title: "Content created",
        description: "Your content has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create content. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreateAuthor = async () => {
    try {
      await addAuthor(newAuthor);
      
      setNewAuthor({
        name: '',
        email: '',
        bio: '',
      });

      toast({
        title: "Author created",
        description: "Author has been added successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create author. Please try again.",
        variant: "destructive",
      });
    }
  };

  const contentByType = {
    post: content.filter(c => c.type === 'post').length,
    case: content.filter(c => c.type === 'case').length,
    statute: content.filter(c => c.type === 'statute').length,
    guide: content.filter(c => c.type === 'guide').length,
    briefing: content.filter(c => c.type === 'briefing').length,
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Content Management</h1>
          <p className="text-muted-foreground">Manage your legal blog content and authors</p>
        </div>
        <Button variant="outline" onClick={signOut}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="create">Create Content</TabsTrigger>
          <TabsTrigger value="manage">Manage Content</TabsTrigger>
          <TabsTrigger value="authors">Authors</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Content</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{content.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Posts</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contentByType.post}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cases</CardTitle>
                <Scale className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contentByType.case}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Statutes</CardTitle>
                <Map className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contentByType.statute}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Guides</CardTitle>
                <Map className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contentByType.guide}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Briefings</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contentByType.briefing}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Content</CardTitle>
              <CardDescription>Add new legal content to your blog</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="content-type">Content Type</Label>
                  <Select 
                    value={newContent.type} 
                    onValueChange={(value: ContentItem['type']) => 
                      setNewContent(prev => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="post">Blog Post</SelectItem>
                      <SelectItem value="case">Case Analysis</SelectItem>
                      <SelectItem value="statute">Statute Note</SelectItem>
                      <SelectItem value="guide">Legal Guide</SelectItem>
                      <SelectItem value="briefing">Legal Briefing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newContent.title}
                    onChange={(e) => setNewContent(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter content title"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                  id="summary"
                  value={newContent.summary}
                  onChange={(e) => setNewContent(prev => ({ ...prev, summary: e.target.value }))}
                  placeholder="Enter content summary"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="categories">Categories (comma-separated)</Label>
                  <Input
                    id="categories"
                    value={newContent.categories.join(', ')}
                    onChange={(e) => setNewContent(prev => ({ 
                      ...prev, 
                      categories: e.target.value.split(',').map(c => c.trim()).filter(Boolean)
                    }))}
                    placeholder="company-law, securities"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={newContent.tags.join(', ')}
                    onChange={(e) => setNewContent(prev => ({ 
                      ...prev, 
                      tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                    }))}
                    placeholder="analysis, regulation"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newContent.content}
                  onChange={(e) => setNewContent(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter your content here"
                  rows={10}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="draft"
                  checked={newContent.draft}
                  onCheckedChange={(checked) => 
                    setNewContent(prev => ({ ...prev, draft: checked as boolean }))
                  }
                />
                <Label htmlFor="draft">Save as draft</Label>
              </div>

              <Button onClick={handleCreateContent} disabled={loading} className="w-full">
                <PlusCircle className="h-4 w-4 mr-2" />
                {loading ? 'Creating...' : 'Create Content'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Manage Content</CardTitle>
              <CardDescription>Edit or delete existing content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {content.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{item.summary}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{item.type}</Badge>
                        {item.draft && <Badge variant="secondary">Draft</Badge>}
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => deleteContent(item.id)}
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {content.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No content available. Create your first piece of content!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="authors" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Add New Author</CardTitle>
                <CardDescription>Add a new author to your blog</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="author-name">Name</Label>
                  <Input
                    id="author-name"
                    value={newAuthor.name}
                    onChange={(e) => setNewAuthor(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Author name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author-email">Email</Label>
                  <Input
                    id="author-email"
                    type="email"
                    value={newAuthor.email}
                    onChange={(e) => setNewAuthor(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="author@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author-bio">Bio</Label>
                  <Textarea
                    id="author-bio"
                    value={newAuthor.bio}
                    onChange={(e) => setNewAuthor(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Author biography"
                    rows={4}
                  />
                </div>

                <Button onClick={handleCreateAuthor} disabled={loading} className="w-full">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  {loading ? 'Adding...' : 'Add Author'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Existing Authors</CardTitle>
                <CardDescription>Manage your blog authors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {authors.map((author) => (
                    <div key={author.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{author.name}</h4>
                        <p className="text-sm text-muted-foreground">{author.email}</p>
                        {author.bio && (
                          <p className="text-sm text-muted-foreground mt-1">{author.bio}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => deleteAuthor(author.id)}
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {authors.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No authors available. Add your first author!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}