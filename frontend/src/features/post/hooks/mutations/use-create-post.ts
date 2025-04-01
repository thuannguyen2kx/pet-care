import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPostMutationFn } from "@/features/post/api";
import { postKeys } from "@/features/post/query-key";

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPostMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.myPosts() });
    },
  });
};
