import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePostMutatinFn } from "@/features/post/api";

export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updatePostMutatinFn,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
      queryClient.invalidateQueries({ queryKey: ['moderationPosts'] });
      queryClient.invalidateQueries({ queryKey: ['reportedPosts'] });
    },
  });
};