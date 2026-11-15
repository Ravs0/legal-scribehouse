import { useBlogStore } from '@/stores/blogStore';

const Authors = () => {
  const { authors } = useBlogStore();

  return (
    <div className="container py-8">
      <p className="label-mono mb-3 text-accent">Insights</p>
      <h1 className="text-4xl font-semibold tracking-tight mb-4">Our Authors</h1>
      <p className="text-lg text-muted-foreground mb-8">Meet our legal experts</p>
    </div>
  );
};

export default Authors;