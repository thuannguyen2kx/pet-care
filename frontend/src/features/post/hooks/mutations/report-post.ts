import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postKeys } from "@/features/post/query-key";
import { reportPostMutationFn } from "@/features/post/api";

// Use report post mutation
export const useReportPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reportPostMutationFn,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: postKeys.detail(variables.id),
      });
    },
  });
};
