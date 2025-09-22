import { useBlogStore } from '@/stores/blogStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Statutes = () => {
  const { getContentByType } = useBlogStore();
  const statutes = getContentByType('statute');

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-4">Statute Notes</h1>
      <p className="text-lg text-muted-foreground mb-8">Legislative analysis and interpretation</p>
      
      <div className="grid gap-6">
        {statutes.map((statute) => (
          <Card key={statute.id}>
            <CardHeader>
              <CardTitle>{statute.title}</CardTitle>
              <CardDescription>{statute.summary}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Statutes;