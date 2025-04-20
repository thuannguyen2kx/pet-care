import React, { useCallback, useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Loader2 } from "lucide-react";
import { PostCard } from "./post-card";
import { PostQueryParams, PostType } from "@/features/post/types/api.types";
import { postKeys } from "@/features/post/query-key";
import { getPostsQueryFn } from "@/features/post/api";
import { Button } from "@/components/ui/button";
import PostCardSkeleton from "./post-card-skeleton";

interface InfinitePostListProps {
  queryParams?: PostQueryParams;
  onEditPost?: (post: PostType) => void;
  emptyMessage?: string;
}

const InfinitePostList: React.FC<InfinitePostListProps> = ({
  queryParams = {},
  onEditPost,
  emptyMessage = "Không có bài viết nào"
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
    refetch
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

  // Handle post edit
  const handleEditPost = useCallback((post: PostType) => {
    if (onEditPost) {
      onEditPost(post);
    } else {
      navigate(`/posts/${post._id}/edit`);
    }
  }, [navigate, onEditPost]);

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

  // Flatten all posts from all pages
  const allPosts = data?.pages.flatMap((page) => page.posts) || [];

  // Handle loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center my-6">
        <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Không thể tải bài viết</h3>
        <p className="text-gray-600 mb-4">{(error as Error).message}</p>
        <Button 
          onClick={() => refetch()}
          className="mx-auto"
        >
          Thử lại
        </Button>
      </div>
    );
  }

  // Handle empty posts
  if (allPosts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center my-6">
        <p className="text-gray-500 mb-4">{emptyMessage}</p>
        <Button onClick={() => navigate("/")}>
          Khám phá bài viết
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {allPosts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          showActions={true}
          onEdit={handleEditPost}
        />
      ))}

      {/* Loading indicator and observer target */}
      <div ref={observerTarget} className="h-20 flex justify-center items-center">
        {isFetchingNextPage && (
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-gray-500">Đang tải thêm bài viết...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfinitePostList;