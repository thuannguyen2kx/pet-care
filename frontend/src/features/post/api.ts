import API from "@/lib/axios-client";
import { ModerationQueryParams, PostQueryParams, PostResponseType, PostsResponseType, PostType, ReportedPostsQueryParams, ReportPostBodyType } from "./types/api.types";

export const createPostMutationFn = async (postData: FormData): Promise<PostType> => {
  const { data } = await API.post('/posts', postData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};
export const updatePostMutatinFn = async ({ id, postData }: { id: string; postData: FormData }) => {
  const { data } = await API.put(`/posts/${id}`, postData);
  return data;
};
export const getPostsQueryFn = async (params?: PostQueryParams): Promise<PostsResponseType> => {
  const { data } = await API.get('/posts', { params });
  return data;
};

export const getPostByIdQueryFn = async (postId: string): Promise<PostResponseType> => {
  const { data } = await API.get(`/posts/${postId}`);
  return data;
};

// Get featured posts
export const getFeaturedPosts = async (
  limit = 5
): Promise<{ posts: PostType[] }> => {
  const { data } = await API.get("/posts/featured", { params: { limit } });
  return data;
};
export const fetchPostsForModeration = async (params: ModerationQueryParams): Promise<PostsResponseType> => {
  const { data } = await API.get(`/posts/admin/moderation`, { params });
  return data;
};
export const fetchReportedPosts = async (params: ReportedPostsQueryParams): Promise<PostsResponseType> => {
  const { data } = await API.get(`/posts/admin/reported`, { params });
  return data;
};
// Get user's own posts
export const getUserPosts = async (params?: PostQueryParams): Promise<PostsResponseType> => {
  const { data } = await API.get('/posts/user/my-posts', { params });
  return data;
};
export const deletePostFn = async (postId: string): Promise<void> => {
  await API.delete(`/posts/${postId}`);
};

export const reportPostMutationFn = async ({
  id,
  reportData,
}: {
  id: string;
  reportData: ReportPostBodyType;
}): Promise<{ message: string; reportCount: number }> => {
  const { data } = await API.post(`/posts/${id}/report`, reportData);
  return data;
};

export const updatePostStatus = async ({
  id,
  status,
  moderationNote,
}: {
  id: string;
  status: 'pending' | 'resolved' | 'rejected';
  moderationNote?: string;
}): Promise<{ message: string; post: PostType }> => {
  const { data } = await API.put(`/posts/${id}/status`, {
    status,
    moderationNote,
  });
  return data;
};
export const setPostFeature = async ({
  id,
  featured,
}: {
  id: string;
  featured: boolean;
}): Promise<{ message: string; post: PostType }> => {
  const { data } = await API.put(`/posts/${id}/featured`, {
    featured,
  });
  return data;
};

export const resolveReport = async ({
  postId,
  reportId,
  status,
  response,
}: {
  postId: string;
  reportId: string;
  status: 'resolved' | 'rejected';
  response?: string;
}): Promise<{ message: string; post: PostType }> => {
  const { data } = await API.put(`/posts/${postId}/reports/${reportId}`, {
    status,
    response,
  });
  return data;
};