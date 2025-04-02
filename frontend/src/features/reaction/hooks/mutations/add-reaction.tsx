import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addReactionMutationFn } from "@/features/reaction/api";
import { toast } from "sonner";

// Add or update reaction
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

      // Snapshot the previous value
      const previousUserReaction = queryClient.getQueryData([
        "userReaction",
        contentType,
        contentId,
      ]);
      const previousReactions = queryClient.getQueryData([
        "reactions",
        contentType,
        contentId,
      ]);

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
            },
          };
        }
      );

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
    },
    onError: (error, variables, context) => {
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

      toast.error(error.message || "Có lỗi xảy ra");
    },
  });
};
