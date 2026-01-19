import { useMyPosts } from '@/features/post/api/get-my-posts';

export const useCustomerMyPostsController = () => {
  const postsQuery = useMyPosts();

  const posts = postsQuery.data?.pages.flatMap((page) => page.posts) ?? [];
  return {
    data: posts,
    isFetching: postsQuery.isLoading,
    isFetchingNextPage: postsQuery.isFetchingNextPage,

    fetchNextPage: postsQuery.fetchNextPage,
    hasNextPage: postsQuery.hasNextPage,
  };
};
