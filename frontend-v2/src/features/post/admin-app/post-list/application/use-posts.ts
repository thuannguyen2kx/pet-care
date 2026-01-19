import { useAdminPostsQuery } from '@/features/post/admin-app/post-list/application/use-posts-query';
import { useAdminPosts } from '@/features/post/api/get-posts';

export const useAdminPostsController = () => {
  const { query, updateQuery } = useAdminPostsQuery();

  const postsQuery = useAdminPosts({ query });

  const posts = postsQuery.data?.pages.flatMap((page) => page.posts) ?? [];
  return {
    query,
    updateQuery,
    data: posts,
    isFetching: postsQuery.isLoading,
    isFetchingNextPage: postsQuery.isFetchingNextPage,

    fetchNextPage: postsQuery.fetchNextPage,
    hasNextPage: postsQuery.hasNextPage,
  };
};
