import { useInfiniteQuery } from "@tanstack/react-query";
import { getCommentQueryFn } from "@/features/comment/api";

export const useGetComments = (postId: string, parentId?: string) => {
  const query = useInfiniteQuery({
    queryKey: ["comments", postId, parentId],
    queryFn: ({ pageParam = 1 }) =>
      getCommentQueryFn({ page: pageParam, postId, parentId }),
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasNextPage
        ? lastPage.pagination.page + 1
        : undefined;
    },
    initialPageParam: 1,
  });

  return query;
};
