import PostDetail from '@/features/post/components/post-details'
import { PostFeatured } from '@/features/post/components/post-featured'

function PostDetailsPage() {
  return (
    <div className="max-w-7xl mx-auto mb-6">
      <PostDetail />
      <PostFeatured />
    </div>
  )
}

export default PostDetailsPage