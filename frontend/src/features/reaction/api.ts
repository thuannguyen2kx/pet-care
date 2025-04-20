import API from "@/lib/axios-client";
import {
  AddReactionRequest,
  ContentType,
  ReactionsResponse,
  UserReactionResponse,
} from "./types/api.types";

// Get the current user's reaction for a specific content
export const getUserReactionQueryFn = async (
  contentType: ContentType,
  contentId: string
): Promise<UserReactionResponse> => {
  const { data } = await API.get(`/reactions/user/${contentType}/${contentId}`);
  return data;
};

// Get reaction counts for a specific content
export const getReactionsQueryFn = async (
  contentType: ContentType,
  contentId: string
): Promise<ReactionsResponse> => {
  const { data } = await API.get(`/reactions/${contentType}/${contentId}`);
  return data;
};

// Add or update a reaction
export const addReactionMutationFn = async ({
  contentType,
  contentId,
  reactionType,
}: AddReactionRequest): Promise<UserReactionResponse> => {
  const { data } = await API.post(`/reactions/${contentType}/${contentId}`, {
    reactionType,
  });
  return data;
};

// Remove a reaction
export const removeReactionMutationFn = async ({
  contentType,
  contentId,
}: {
  contentType: ContentType;
  contentId: string;
}): Promise<void> => {
  await API.delete(`/reactions/${contentType}/${contentId}`);
};

// Get users who reacted to content
export const getReactorsQueryFn = async (
  contentType: ContentType,
  contentId: string,
  reactionType?: string
): Promise<{
  reactors: Array<{
    userId: {
      _id: string;
      fullName: string;
      profilePicture?: {
        url: string;
      };
    };
    reactionType: string;
  }>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}> => {
  const params = reactionType ? { reactionType } : {};
  const { data } = await API.get(
    `/reactions/${contentType}/${contentId}/users`,
    { params }
  );
  return data;
};
