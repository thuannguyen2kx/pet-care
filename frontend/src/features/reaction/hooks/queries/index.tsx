import { useQuery } from "@tanstack/react-query";
import { 
  ContentType, 
  ReactionsResponse,
  UserReactionResponse
} from "@/features/reaction/types/api.types";
import { 
  getUserReactionQueryFn, 
  getReactionsQueryFn, 
  getReactorsQueryFn 
} from "@/features/reaction/api";

// Hook to get the current user's reaction
export const useUserReaction = (contentType: ContentType, contentId: string) => {
  return useQuery<UserReactionResponse>({
    queryKey: ["userReaction", contentType, contentId],
    queryFn: () => getUserReactionQueryFn(contentType, contentId),
    enabled: !!contentId,
  });
};

// Hook to get reaction counts
export const useReactions = (contentType: ContentType, contentId: string) => {
  return useQuery<ReactionsResponse>({
    queryKey: ["reactions", contentType, contentId],
    queryFn: () => getReactionsQueryFn(contentType, contentId),
    enabled: !!contentId,
  });
};

// Hook to get users who reacted to content
export const useReactors = (
  contentType: ContentType, 
  contentId: string, 
  reactionType?: string
) => {
  return useQuery({
    queryKey: ["reactors", contentType, contentId, reactionType],
    queryFn: () => getReactorsQueryFn(contentType, contentId, reactionType),
    // Only fetch if we have a valid content ID
    enabled: !!contentId,
  });
};