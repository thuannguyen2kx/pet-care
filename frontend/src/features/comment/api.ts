import API from "@/lib/axios-client";
import { CommentsResponseType, GetCommentParamsType } from "./types/api.types";

export const getCommentsQueryFn = async ({
  page,
  postId,
  parentId,
}: GetCommentParamsType): Promise<CommentsResponseType> => {
  const params = new URLSearchParams({ page: page.toString(), limit: "10" });

  if (parentId) {
    params.append("parentId", parentId);
  }

  const response = await API.get(
    `/posts/${postId}/comments?${params.toString()}`
  );
  return response.data;
};

export const addCommentMutationFn = async ({
  postId,
  content,
  parentCommentId,
}: {
  postId: string;
  content: string;
  parentCommentId?: string;
}) => {
  const response = await API.post(`/posts/${postId}/comments`, {
    content,
    parentCommentId,
  });
  return response.data;
};

export const updateCommentMutationFn = async ({
  commentId,
  content,
}: {
  commentId: string;
  content: string;
}) => {
  const response = await API.put(`/posts/comments/${commentId}`, {
    content,
  });
  return response.data;
};

export const deleteCommentMutationFn = async (commentId: string) => {
  const response = await API.delete(`/posts/comments/${commentId}`);
  return response.data;
};
