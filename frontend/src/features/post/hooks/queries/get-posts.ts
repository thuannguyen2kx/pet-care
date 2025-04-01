import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  PostQueryParams,
  PostsResponseType,
} from "@/features/post/types/api.types";
import { getPostsQueryFn } from "@/features/post/api";
import { postKeys } from "@/features/post/query-key";

export const usePostsQuery = (
  params?: PostQueryParams,
  options?: UseQueryOptions<PostsResponseType>
) => {
  const query = useQuery({
    queryKey: postKeys.list(params || {}),
    queryFn: () => getPostsQueryFn(params),
    ...options,
  });
  return query;
};
