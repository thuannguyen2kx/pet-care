import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setPostFeature } from "@/features/post/api";

export const useSetPostFeatureMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: setPostFeature,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['featuredPosts'] });
    },
  });
};