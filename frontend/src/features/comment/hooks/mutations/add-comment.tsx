import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCommentMutationFn } from "@/features/comment/api";
import { toast } from "sonner";

export const useAddComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: addCommentMutationFn,
    onSuccess: (_, variables) => {
      // Invalidate comments query to refetch
      queryClient.invalidateQueries({ queryKey: ["comments", variables.postId] });
      
      // If this is a reply, also invalidate the parent comment's replies
      if (variables.parentCommentId) {
        queryClient.invalidateQueries({ 
          queryKey: ["comments", variables.postId, variables.parentCommentId] 
        });
      }
      
      toast.success("Đã thêm bình luận");
    },
    onError: (error) => {
      toast.error(error.message || "Có lỗi xảy ra");
    }
  });
};