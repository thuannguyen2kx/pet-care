import { Camera, Heart, MessageCircle } from "lucide-react";
import { useUserPosts } from "../hooks/queries/get-user-post";
import { PostType } from "../types/api.types";

export const UserPostList = () => {
  const { data, isLoading } = useUserPosts();
  const posts = data?.posts || [];

  if (isLoading) return <div>Loading...</div>;
  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {posts.map((post) => (
          <UserPostItem key={post._id} post={post} />
        ))}
      </div>
      {posts.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-orange-50 inline-flex rounded-full p-4 mb-4">
            <Camera className="h-8 w-8 text-orange-500" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Bạn chưa có bài viết nào
          </h3>
          <p className="text-gray-500 max-w-md mx-auto mb-4">
            Chia sẻ ảnh và thông tin cập nhật về thú cưng của bạn với cộng đồng.
          </p>
        </div>
      )}
    </>
  );
};

function UserPostItem({ post }: { post: PostType }) {
  return (
    <div className="aspect-square bg-gray-100 relative cursor-pointer overflow-hidden group">
      {post.media && post.media.length > 0 && (
        <div className="relative aspect-square overflow-hidden bg-muted">
          {post.media[0].type === "image" ? (
            <img
              src={post.media[0].url}
              alt={"Post image"}
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              src={post.media[0].url}
              controls
              className="w-full h-full object-cover"
            />
          )}
        </div>
      )}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
        <div className="flex items-center gap-4 text-white">
          <div className="flex items-center gap-1">
            <Heart className="h-5 w-5 fill-white" />
            <span className="font-medium">{post.stats.likeCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-5 w-5 fill-white" />
            <span className="font-medium">{post.stats.commentCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
