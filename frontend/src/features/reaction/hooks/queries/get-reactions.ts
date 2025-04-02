import { useQuery } from "@tanstack/react-query";
import { ContentType } from "@/features/reaction/types/api.types";
import { getReactionsQueryFn } from "@/features/reaction/api";

// Get all reactions for content
export const useReactions = (contentType: ContentType, contentId: string) => {
  return useQuery({
    queryKey: ["reactions", contentType, contentId],
    queryFn: () => getReactionsQueryFn({ contentType, contentId }),
    enabled: !!contentId,
  });
};
