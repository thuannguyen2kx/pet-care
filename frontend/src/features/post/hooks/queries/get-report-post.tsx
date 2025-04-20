import { useQuery } from "@tanstack/react-query";
import { ReportedPostsQueryParams } from "@/features/post/types/api.types";
import { fetchReportedPosts } from "@/features/post/api";

export const useReportedPostsQuery = (params: ReportedPostsQueryParams) => {
  return useQuery({
    queryKey: ['reportedPosts', params],
    queryFn: () => fetchReportedPosts(params),
  });
}