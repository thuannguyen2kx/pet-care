import { useAdminFeaturedPosts } from '@/features/post/api/get-featured-posts';

export const useAdminFeaturedPostsController = () => {
  const postsQuery = useAdminFeaturedPosts();

  const posts = postsQuery.data?.pages.flatMap((page) => page.posts) ?? [];
  return {
    data: posts,
    isFetching: postsQuery.isLoading,
    isFetchingNextPage: postsQuery.isFetchingNextPage,

    fetchNextPage: postsQuery.fetchNextPage,
    hasNextPage: postsQuery.hasNextPage,
  };
};
