import { useBlogStore } from '@/stores/blogStore';

const Authors = () => {
  const { authors } = useBlogStore();

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-4">Our Authors</h1>
      <p className="text-lg text-muted-foreground mb-8">Meet our legal experts</p>
    </div>
  );
};

export default Authors;