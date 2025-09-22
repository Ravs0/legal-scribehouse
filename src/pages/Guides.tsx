import { useBlogStore } from '@/stores/blogStore';

const Guides = () => {
  const { getContentByType } = useBlogStore();
  const guides = getContentByType('guide');

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-4">Legal Guides</h1>
      <p className="text-lg text-muted-foreground mb-8">Comprehensive legal guides</p>
    </div>
  );
};

export default Guides;