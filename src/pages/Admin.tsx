import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit, Trash2, Save } from 'lucide-react';
import { useBlogStore } from '@/stores/blogStore';
import { ContentItem, Author, LEGAL_CATEGORIES } from '@/types/blog';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const { content, authors, addContent, updateContent, deleteContent, addAuthor } = useBlogStore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);
  const [newContentForm, setNewContentForm] = useState({
    type: 'post' as ContentItem['type'],
    title: '',
    summary: '',
    content: '',
    categories: [] as string[],
    tags: '',
    authors: [] as string[],
    draft: true,
  });

  const handleCreateContent = () => {
    const newContent: ContentItem = {
      id: `content-${Date.now()}`,
      title: newContentForm.title,
      slug: newContentForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      date: new Date().toISOString().split('T')[0],
      summary: newContentForm.summary,
      content: newContentForm.content,
      categories: newContentForm.categories,
      tags: newContentForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      authors: newContentForm.authors,
      draft: newContentForm.draft,
      type: newContentForm.type,
      ...(newContentForm.type === 'case' && {
        court: '',
        jurisdiction: '',
        citation: '',
        holding: '',
        rationale: '',
      }),
      ...(newContentForm.type === 'statute' && {
        act: '',
        section: '',
        interpretation: '',
      }),
    } as ContentItem;

    addContent(newContent);
    setNewContentForm({
      type: 'post',
      title: '',
      summary: '',
      content: '',
      categories: [],
      tags: '',
      authors: [],
      draft: true,
    });
    toast({
      title: 'Content Created',
      description: 'Your content has been saved successfully.',
    });
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Content Management</h1>
        <p className="text-lg text-muted-foreground">
          Manage your legal blog content and authors
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="create">Create</TabsTrigger>
          <TabsTrigger value="manage">Manage</TabsTrigger>
          <TabsTrigger value="authors">Authors</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Content</p>
                    <p className="text-2xl font-bold">{content.length}</p>
                  </div>
                  <Badge variant="secondary">{content.filter(c => !c.draft).length} published</Badge>
                </div>
              </CardContent>
            </Card>
            
            {['post', 'case', 'statute', 'guide', 'briefing'].map(type => (
              <Card key={type}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground capitalize">{type}s</p>
                      <p className="text-2xl font-bold">
                        {content.filter(c => c.type === type).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Content</CardTitle>
              <CardDescription>Add new legal analysis, case digest, or other content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Content Type</Label>
                  <Select value={newContentForm.type} onValueChange={(value) => setNewContentForm({...newContentForm, type: value as ContentItem['type']})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="post">Analysis/Opinion</SelectItem>
                      <SelectItem value="case">Case Digest</SelectItem>
                      <SelectItem value="statute">Statute Note</SelectItem>
                      <SelectItem value="guide">Guide</SelectItem>
                      <SelectItem value="briefing">Briefing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="draft" 
                    checked={newContentForm.draft}
                    onCheckedChange={(checked) => setNewContentForm({...newContentForm, draft: checked as boolean})}
                  />
                  <Label htmlFor="draft">Save as draft</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newContentForm.title}
                  onChange={(e) => setNewContentForm({...newContentForm, title: e.target.value})}
                  placeholder="Enter content title"
                />
              </div>

              <div>
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                  id="summary"
                  value={newContentForm.summary}
                  onChange={(e) => setNewContentForm({...newContentForm, summary: e.target.value})}
                  placeholder="Brief summary or description"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="categories">Categories</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {LEGAL_CATEGORIES.map(category => (
                    <Badge
                      key={category.id}
                      variant={newContentForm.categories.includes(category.id) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        const categories = newContentForm.categories.includes(category.id)
                          ? newContentForm.categories.filter(c => c !== category.id)
                          : [...newContentForm.categories, category.id];
                        setNewContentForm({...newContentForm, categories});
                      }}
                    >
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={newContentForm.tags}
                  onChange={(e) => setNewContentForm({...newContentForm, tags: e.target.value})}
                  placeholder="tag1, tag2, tag3"
                />
              </div>

              <div>
                <Label htmlFor="content">Content (Markdown supported)</Label>
                <Textarea
                  id="content"
                  value={newContentForm.content}
                  onChange={(e) => setNewContentForm({...newContentForm, content: e.target.value})}
                  placeholder="Write your content in markdown format"
                  rows={15}
                />
              </div>

              <Button onClick={handleCreateContent} disabled={!newContentForm.title}>
                <Save className="mr-2 h-4 w-4" />
                Create Content
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          <div className="grid gap-4">
            {content.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{item.type}</Badge>
                        {item.draft && <Badge variant="destructive">Draft</Badge>}
                      </div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{item.summary}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(item.date).toLocaleDateString()} • {item.categories.length} categories • {item.tags.length} tags
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteContent(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="authors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Authors</CardTitle>
              <CardDescription>Manage blog contributors and their profiles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {authors.map((author) => (
                  <div key={author.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{author.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{author.bio}</p>
                      <Badge variant="outline" className="mt-2">
                        {content.filter(c => c.authors.includes(author.id)).length} articles
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;