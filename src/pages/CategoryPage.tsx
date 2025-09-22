import { useParams } from 'react-router-dom';
import { useBlogStore } from '@/stores/blogStore';
import { LEGAL_CATEGORIES } from '@/types/blog';

const CategoryPage = () => {
  const { category } = useParams();
  const { getContentByCategory } = useBlogStore();
  const categoryInfo = LEGAL_CATEGORIES.find(c => c.slug === category);
  const content = getContentByCategory(categoryInfo?.id || '');

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-4">{categoryInfo?.name}</h1>
      <p className="text-lg text-muted-foreground mb-8">{content.length} articles</p>
    </div>
  );
};

export default CategoryPage;