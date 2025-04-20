import { useQuery } from "@tanstack/react-query";
import { fetchPostsForModeration } from "@/features/post/api";
import { ModerationQueryParams } from "@/features/post/types/api.types";

export const usePostsForModerationQuery = (params: ModerationQueryParams) => {
  return useQuery({
    queryKey: ['moderationPosts', params],
    queryFn: () => fetchPostsForModeration(params),
  });
};