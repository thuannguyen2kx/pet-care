import { useFeaturedPosts } from '@/features/post/api/get-featured-posts';

export const useFeaturedPostsController = () => {
  const postsQuery = useFeaturedPosts();

  const posts = postsQuery.data?.pages.flatMap((page) => page.posts) ?? [];
  return {
    data: posts,
    isFetching: postsQuery.isLoading,
    isFetchingNextPage: postsQuery.isFetchingNextPage,

    fetchNextPage: postsQuery.fetchNextPage,
    hasNextPage: postsQuery.hasNextPage,
  };
};
