import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCommentMutationFn } from "../../api";
import { toast } from "sonner";

export const useUpdateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateCommentMutationFn,
    onSuccess: (data) => {
      // Get postId from the returned comment
      const postId = data.comment.postId;
      
      // Invalidate comments query to refetch
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      
      toast.success("Đã cập nhật bình luận");
    },
    onError: (error) => {
      toast.error(error.message || "Có lỗi khi cập nhật bình luận");
    }
  });
};