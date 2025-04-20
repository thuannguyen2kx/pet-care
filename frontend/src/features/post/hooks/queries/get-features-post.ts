import { useQuery } from "@tanstack/react-query";
import { getFeaturedPosts } from "@/features/post/api";

export const useFeaturedPostsQuery = (limit?: number) => {
  return useQuery({
    queryKey: ['featuredPosts', limit],
    queryFn: () => getFeaturedPosts(limit),
  });
};