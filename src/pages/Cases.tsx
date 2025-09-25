import { useBlogStore } from '@/stores/blogStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const Cases = () => {
  const { getContentByType, authors } = useBlogStore();
  const cases = getContentByType('case');

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-4">Case Digests</h1>
      <p className="text-lg text-muted-foreground mb-8">Court decisions and tribunal rulings</p>
      
      <div className="grid gap-6">
        {cases.map((caseItem) => (
          <Card key={caseItem.id}>
            <CardHeader>
              <CardTitle>
                <Link to={`/posts/${caseItem.id}`} className="hover:text-primary">
                  {caseItem.title}
                </Link>
              </CardTitle>
              <CardDescription>{caseItem.summary}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                {caseItem.categories.map(cat => (
                  <Badge key={cat} variant="secondary">{cat}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Cases;