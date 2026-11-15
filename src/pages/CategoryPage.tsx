import { useParams } from 'react-router-dom';
import { LEGAL_CATEGORIES } from '@/types/blog';
import { InsightsListing } from './Insights';

const CategoryPage = () => {
  const { category } = useParams();
  const info = LEGAL_CATEGORIES.find((c) => c.slug === category);
  return (
    <InsightsListing
      category={info?.id ?? category}
      title={`${info?.name ?? 'Topic'}.`}
      subtitle={info?.description ?? 'Everything we have published on this topic.'}
    />
  );
};
export default CategoryPage;
