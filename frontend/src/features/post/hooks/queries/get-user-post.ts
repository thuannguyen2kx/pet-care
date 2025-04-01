import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { PostQueryParams, PostsResponseType } from "@/features/post/types/api.types";
import { postKeys } from "@/features/post/query-key";
import { getUserPosts } from "@/features/post/api";

export const useUserPosts = (
  params?: PostQueryParams,
  options?: UseQueryOptions<PostsResponseType>
) => {
  return useQuery({
    queryKey: [...postKeys.myPosts(), params || {}],
    queryFn: () => getUserPosts(params),
    ...options,
  });
};