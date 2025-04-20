import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePostStatus } from "@/features/post/api";

export const useUpdatePostStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePostStatus,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["moderationPosts"] });
      queryClient.invalidateQueries({ queryKey: ["reportedPosts"] });
    },
  });
};
