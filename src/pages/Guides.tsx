import { useBlogStore } from '@/stores/blogStore';

const Guides = () => {
  const { getContentByType } = useBlogStore();
  const guides = getContentByType('guide');

  return (
    <div className="container py-8">
      <p className="label-mono mb-3 text-accent">Insights</p>
      <h1 className="text-4xl font-semibold tracking-tight mb-4">Legal Guides</h1>
      <p className="text-lg text-muted-foreground mb-8">Comprehensive legal guides</p>
    </div>
  );
};

export default Guides;