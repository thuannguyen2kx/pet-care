import API from "@/lib/axios-client";
import { PostQueryParams, PostResponseType, PostsResponseType, PostType } from "./types/api.types";

export const createPostMutationFn = async (postData: FormData): Promise<PostType> => {
  const { data } = await API.post('/posts', postData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
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
export const getFeaturedPosts = async (limit = 5): Promise<PostType[]> => {
  const { data } = await API.get('/posts/featured', { params: { limit } });
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