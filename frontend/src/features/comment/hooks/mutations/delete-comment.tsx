import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCommentMutationFn } from "../../api";
import { toast } from "sonner";

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteCommentMutationFn,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSuccess: (_, commentId) => {
      // We need to find the postId to invalidate the correct query
      // This requires us to either have the postId passed in additionally
      // or to get it from the cache
      
      // Get all comments queries from the cache
      const queries = queryClient.getQueriesData<{ pages: { comments: Comment[] }[] }>({
        queryKey: ["comments"]
      });
      
      // Find the query that contains the comment
      queries.forEach(([queryKey]) => {
        if (Array.isArray(queryKey) && queryKey.length >= 2) {
          const postId = queryKey[1];
          queryClient.invalidateQueries({ queryKey: ["comments", postId] });
        }
      });
      
      toast.success("Bình luận đã được xoá");
    },
    onError: (error) => {
      toast.error(error.message || "Có lỗi xảy ra khi xoá bình luận");
    }
  });
};