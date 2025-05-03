import { useCallback, useEffect, useRef } from "react";
import { Camera, Heart, MessageCircle, Loader2 } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { PostType } from "../types/api.types";
import { useAuthContext } from "@/context/auth-provider";
import { postKeys } from "@/features/post/query-key";
import { getUserPosts } from "@/features/post/api";
import { useNavigate } from "react-router-dom";

interface UserPostListProps {
  profileId: string;
}

export const UserPostList = ({ profileId }: UserPostListProps) => {
  const { user } = useAuthContext();
  const observerTarget = useRef<HTMLDivElement>(null);
  const isOwner = user?._id === profileId;

  // Set up infinite query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: postKeys.userPosts(profileId),
    queryFn: ({ pageParam = 1 }) =>
      getUserPosts({ userId: profileId, params: { page: pageParam } }),
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      return pagination.hasNextPage ? pagination.currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });

  // Flatten all posts from all pages
  const allPosts = data?.pages.flatMap((page) => page.posts) || [];

  // Set up intersection observer for infinite scroll
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const element = observerTarget.current;
    const option = { threshold: 0.5 };

    const observer = new IntersectionObserver(handleObserver, option);
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [handleObserver]);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div 
            key={i} 
            className="aspect-square bg-gray-200 animate-pulse rounded"
          />
        ))}
      </div>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <div className="text-center py-6">
        <p className="text-red-500">{(error as Error).message}</p>
      </div>
    );
  }

  // Handle empty posts
  if (allPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-orange-50 inline-flex rounded-full p-4 mb-4">
          <Camera className="h-8 w-8 text-orange-500" />
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">
          {isOwner
            ? "Bạn chưa có bài viết nào"
            : "Người dùng chưa đăng bài viết nào"}
        </h3>
        {isOwner && (
          <p className="text-gray-500 max-w-md mx-auto mb-4">
            Chia sẻ ảnh và thông tin cập nhật về thú cưng của bạn với cộng đồng.
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        {allPosts.map((post) => (
          <UserPostItem key={post._id} post={post} />
        ))}
      </div>
      
      {/* Loading indicator and observer target */}
      <div 
        ref={observerTarget} 
        className="h-20 flex justify-center items-center"
      >
        {isFetchingNextPage && (
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        )}
      </div>
    </div>
  );
};

function UserPostItem({ post }: { post: PostType }) {
  const navigate = useNavigate()
  return (
    <div onClick={() => navigate(`/posts/${post._id}`)} className="aspect-square bg-gray-100 relative cursor-pointer overflow-hidden group">
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