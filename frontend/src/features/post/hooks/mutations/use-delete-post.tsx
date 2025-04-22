import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deletePostFn } from "@/features/post/api";
import { postKeys } from "@/features/post/query-key";

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deletePostFn,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      toast.success("Bài viết đã được xoá");
    },
    onError: () => {
      toast.error("Có lỗi khi xoá bài viết");
    },
  });

  return mutation;
};
