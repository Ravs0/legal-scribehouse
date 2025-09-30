import { useParams } from 'react-router-dom';
import { useBlogStore } from '@/stores/blogStore';

const PostDetail = () => {
  const { id } = useParams();
  const { content } = useBlogStore();
  const post = content.find(p => p.id === id);

  if (!post) {
    return <div className="container py-8">Content not found</div>;
  }

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
};

export default PostDetail;