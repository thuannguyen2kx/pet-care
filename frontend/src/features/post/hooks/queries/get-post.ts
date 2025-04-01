import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { PostResponseType } from "@/features/post/types/api.types";
import { postKeys } from "@/features/post/query-key";
import { getPostByIdQueryFn } from "@/features/post/api";

// Use post detail query
export const usePostDetailQuery = (
  id: string,
  options?: UseQueryOptions<PostResponseType>
) => {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => getPostByIdQueryFn(id),
    ...options,
  });
};
