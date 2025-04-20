import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resolveReport } from "@/features/post/api";

export const useResolveReportMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: resolveReport,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['reportedPosts'] });
    },
  });
};