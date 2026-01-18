import { usePosts } from '@/features/post/api/get-posts';
import { usePostsQuery } from '@/features/post/customer-app/feeds/application/use-posts-query';

export const usePostsController = () => {
  const { query, updateQuery } = usePostsQuery();

  const postsQuery = usePosts({ query });

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
