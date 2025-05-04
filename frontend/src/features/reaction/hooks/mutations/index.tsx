import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addReactionMutationFn, removeReactionMutationFn } from "@/features/reaction/api";
import { toast } from "sonner";
import { ReactionItemType } from "@/features/reaction/types/api.types";

// Hook for adding or updating a reaction
export const useAddReaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: addReactionMutationFn,
    
    onMutate: async ({ contentType, contentId, reactionType }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["userReaction", contentType, contentId],
      });
      await queryClient.cancelQueries({
        queryKey: ["reactions", contentType, contentId],
      });
      
      // Snapshot the previous values
      const previousUserReaction = queryClient.getQueryData([
        "userReaction", 
        contentType, 
        contentId
      ]);
      
      const previousReactions = queryClient.getQueryData([
        "reactions", 
        contentType, 
        contentId
      ]);
      
      // Get the current reaction counts
      const currentReactions = queryClient.getQueryData([
        "reactions", 
        contentType, 
        contentId
      ]) as { counts: Record<ReactionItemType | "total", number> } | undefined;
      
      // Get current user reaction
      const currentUserReaction = queryClient.getQueryData([
        "userReaction", 
        contentType, 
        contentId
      ]) as { reaction: { reactionType: ReactionItemType } | null } | undefined;
      
      // Optimistically update the user reaction
      queryClient.setQueryData(
        ["userReaction", contentType, contentId],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (old: any) => {
          return {
            ...old,
            reaction: {
              ...old?.reaction,
              reactionType,
              contentType,
              contentId,
            },
          };
        }
      );
      
      // Optimistically update reaction counts
      if (currentReactions) {
        const newCounts = { ...currentReactions.counts };
        
        // If user already had a reaction, decrement that count
        if (currentUserReaction?.reaction) {
          const prevType = currentUserReaction.reaction.reactionType;
          newCounts[prevType] = Math.max(0, (newCounts[prevType] || 0) - 1);
        } else {
          // If no previous reaction, increment total
          newCounts.total = (newCounts.total || 0) + 1;
        }
        
        // Increment the new reaction type count
        newCounts[reactionType] = (newCounts[reactionType] || 0) + 1;
        
        queryClient.setQueryData(
          ["reactions", contentType, contentId],
          {
            ...currentReactions,
            counts: newCounts
          }
        );
      }
      
      return { previousUserReaction, previousReactions };
    },
    
    onSuccess: (_, variables) => {
      // Invalidate relevant queries to refetch fresh data
      queryClient.invalidateQueries({
        queryKey: ["userReaction", variables.contentType, variables.contentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["reactions", variables.contentType, variables.contentId],
      });
      
      // If the content is a post, also invalidate the post details
      if (variables.contentType === "post") {
        queryClient.invalidateQueries({
          queryKey: ["posts", "detail", variables.contentId],
        });
      }
    },
    
    onError: (_, variables, context) => {
      // Rollback to previous values
      if (context?.previousUserReaction) {
        queryClient.setQueryData(
          ["userReaction", variables.contentType, variables.contentId],
          context.previousUserReaction
        );
      }
      
      if (context?.previousReactions) {
        queryClient.setQueryData(
          ["reactions", variables.contentType, variables.contentId],
          context.previousReactions
        );
      }
      
      toast.error("Có lỗi xảy ra khi thực hiện");
    },
  });
};

// Hook for removing a reaction
export const useRemoveReaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: removeReactionMutationFn,
    
    onMutate: async ({ contentType, contentId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["userReaction", contentType, contentId],
      });
      await queryClient.cancelQueries({
        queryKey: ["reactions", contentType, contentId],
      });
      
      // Snapshot the previous values
      const previousUserReaction = queryClient.getQueryData([
        "userReaction", 
        contentType, 
        contentId
      ]);
      
      const previousReactions = queryClient.getQueryData([
        "reactions", 
        contentType, 
        contentId
      ]);
      
      // Get the current reaction counts
      const currentReactions = queryClient.getQueryData([
        "reactions", 
        contentType, 
        contentId
      ]) as { counts: Record<ReactionItemType | "total", number> } | undefined;
      
      // Get current user reaction
      const currentUserReaction = queryClient.getQueryData([
        "userReaction", 
        contentType, 
        contentId
      ]) as { reaction: { reactionType: ReactionItemType } | null } | undefined;
      
      // Optimistically update the user reaction to null
      queryClient.setQueryData(
        ["userReaction", contentType, contentId],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (old: any) => ({
          ...old,
          reaction: null,
        })
      );
      
      // Optimistically update reaction counts
      if (currentReactions && currentUserReaction?.reaction) {
        const newCounts = { ...currentReactions.counts };
        const prevType = currentUserReaction.reaction.reactionType;
        
        // Decrement the reaction type count
        newCounts[prevType] = Math.max(0, (newCounts[prevType] || 0) - 1);
        
        // Decrement total count
        newCounts.total = Math.max(0, (newCounts.total || 0) - 1);
        
        queryClient.setQueryData(
          ["reactions", contentType, contentId],
          {
            ...currentReactions,
            counts: newCounts
          }
        );
      }
      
      return { previousUserReaction, previousReactions };
    },
    
    onSuccess: (_, variables) => {
      // Invalidate relevant queries to refetch fresh data
      queryClient.invalidateQueries({
        queryKey: ["userReaction", variables.contentType, variables.contentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["reactions", variables.contentType, variables.contentId],
      });
      
      // If the content is a post, also invalidate the post details
      if (variables.contentType === "post") {
        queryClient.invalidateQueries({
          queryKey: ["posts", "detail", variables.contentId],
        });
      }
    },
    
    onError: (_, variables, context) => {
      // Rollback to previous values
      if (context?.previousUserReaction) {
        queryClient.setQueryData(
          ["userReaction", variables.contentType, variables.contentId],
          context.previousUserReaction
        );
      }
      
      if (context?.previousReactions) {
        queryClient.setQueryData(
          ["reactions", variables.contentType, variables.contentId],
          context.previousReactions
        );
      }
      
      toast.error("Có lỗi xảy ra khi thực hiện");
    },
  });
};