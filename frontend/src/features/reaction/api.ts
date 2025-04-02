import API from "@/lib/axios-client";
import {
  ContentType,
  ReactionItemType,
  ReactionsResponseType,
  UserReactionResponse,
} from "./types/api.types";

export const getReactionsQueryFn = async ({
  contentType,
  contentId,
}: {
  contentType: ContentType;
  contentId: string;
}): Promise<ReactionsResponseType> => {
  const response = await API.get<ReactionsResponseType>(
    `/${contentType}/${contentId}/reactions`
  );
  return response.data;
};
export const getUserReactionQueryFn = async ({
  contentType,
  contentId,
}: {
  contentType: ContentType;
  contentId: string;
}): Promise<UserReactionResponse> => {
  const response = await API.get(`/${contentType}/${contentId}/reactions/me`);
  return response.data;
};

export const addReactionMutationFn = async ({
  contentType,
  contentId,
  reactionType,
}: {
  contentType: ContentType;
  contentId: string;
  reactionType: ReactionItemType;
}) => {
  const response = await API.post(`${contentType}/${contentId}/react`, {
    reactionType,
  });
  return response.data;
};

export const removeReactionMutationFn = async ({
  contentType,
  contentId,
}: {
  contentType: ContentType;
  contentId: string;
}) => {
  const response = await API.delete(`/${contentType}/${contentId}/react`);
  return response.data;
};
