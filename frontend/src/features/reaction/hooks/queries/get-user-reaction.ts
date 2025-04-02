import { ContentType } from "@/features/reaction/types/api.types";
import { getUserReactionQueryFn } from "../../api";
import { useQuery } from "@tanstack/react-query";

// Get current user's reaction
export const useUserReaction = (
  contentType: ContentType,
  contentId: string
) => {
  return useQuery({
    queryKey: ["userReaction", contentType, contentId],
    queryFn: () => getUserReactionQueryFn({ contentType, contentId }),
    enabled: !!contentId,
  });
};
