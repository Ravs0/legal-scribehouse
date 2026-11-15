import { useBlogStore } from '@/stores/blogStore';

const Briefings = () => {
  const { getContentByType } = useBlogStore();
  const briefings = getContentByType('briefing');

  return (
    <div className="container py-8">
      <p className="label-mono mb-3 text-accent">Insights</p>
      <h1 className="text-4xl font-semibold tracking-tight mb-4">Legal Briefings</h1>
      <p className="text-lg text-muted-foreground mb-8">Quick updates and developments</p>
    </div>
  );
};

export default Briefings;