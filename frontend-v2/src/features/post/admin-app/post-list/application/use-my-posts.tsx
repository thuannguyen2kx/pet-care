import { useAdminMyPosts } from '@/features/post/api/get-my-posts';

export const useAdminMyPostsController = () => {
  const postsQuery = useAdminMyPosts();

  const posts = postsQuery.data?.pages.flatMap((page) => page.posts) ?? [];
  return {
    data: posts,
    isFetching: postsQuery.isLoading,
    isFetchingNextPage: postsQuery.isFetchingNextPage,

    fetchNextPage: postsQuery.fetchNextPage,
    hasNextPage: postsQuery.hasNextPage,
  };
};
