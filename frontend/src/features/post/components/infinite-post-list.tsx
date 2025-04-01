import React, { useCallback, useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { PostCard } from "./post-card";
import { PostQueryParams, PostType } from "../types/api.types";
import { getPostsQueryFn } from "../api";
import { postKeys } from "../query-key";
import { toast } from "sonner";

interface InfinitePostListProps {
  queryParams?: PostQueryParams;
  onEditPost?: (post: PostType) => void;
  onDeletePost?: (postId: string) => Promise<void>;
}

const InfinitePostList: React.FC<InfinitePostListProps> = ({
  queryParams = {},
  onEditPost,
  onDeletePost,
}) => {
  const navigate = useNavigate();
  const observerTarget = useRef<HTMLDivElement>(null);

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
    queryKey: postKeys.infinite(queryParams),
    queryFn: ({ pageParam = 1 }) =>
      getPostsQueryFn({ ...queryParams, page: pageParam }),
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      return pagination.hasNextPage ? pagination.currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });

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

  // Handle post deletion
  const handleDelete = async (postId: string) => {
    if (!onDeletePost) return;

    try {
      await onDeletePost(postId);
      toast("Xoá bài viết thành công");
    } catch  {
      toast("Có lỗi khi xoá bài viết");
    }
  };

  // Flatten all posts from all pages
  const allPosts = data?.pages.flatMap((page) => page.posts) || [];

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Error loading posts: {(error as Error).message}</p>
        <button 
          onClick={() => navigate(0)} 
          className="mt-3 px-4 py-2 bg-primary text-white rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }

  // Handle empty posts
  if (allPosts.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No posts found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-10">
      {allPosts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          showActions={true}
          onEdit={onEditPost}
          onDelete={handleDelete}
        />
      ))}

      {/* Loading indicator and observer target */}
      <div ref={observerTarget} className="h-10 flex justify-center items-center">
        {isFetchingNextPage && (
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        )}
      </div>
    </div>
  );
};

export default InfinitePostList;