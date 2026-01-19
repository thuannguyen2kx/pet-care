import {
  useMutation,
  useQueryClient,
  type InfiniteData,
  type UseMutationOptions,
} from '@tanstack/react-query';

import { postQueryKeys } from '@/features/post/api/query-keys';
import { CreatePostResponseSchema } from '@/features/post/domain/post-http-schema';
import type { Post } from '@/features/post/domain/post.entity';
import type { CreatePost } from '@/features/post/domain/post.state';
import { mapCreatePostToDto, mapPostDtoToEntity } from '@/features/post/domain/post.transform';
import { POST_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';

const createPost = (data: FormData) => {
  return http.post(POST_ENDPOINTS.CREATE, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

type UseCreatePostOptions = {
  mutationConfig?: UseMutationOptions<Post, unknown, CreatePost, unknown>;
};
export const useCreatePost = ({ mutationConfig }: UseCreatePostOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = mutationConfig || {};

  return useMutation({
    onSuccess: async (data, ...args) => {
      queryClient.setQueriesData<InfiniteData<{ posts: Post[] }>>(
        { queryKey: postQueryKeys.customer.lists() },
        (old) => prependPostToInfiniteData(old, data),
      );
      queryClient.setQueriesData<InfiniteData<{ posts: Post[] }>>(
        { queryKey: postQueryKeys.customer.my_posts() },
        (old) => prependPostToInfiniteData(old, data),
      );
      onSuccess?.(data, ...args);
    },
    ...rest,
    mutationFn: async (createPostData: CreatePost) => {
      const formData = mapCreatePostToDto(createPostData);
      const raw = await createPost(formData);
      const response = CreatePostResponseSchema.parse(raw);
      return mapPostDtoToEntity(response.post);
    },
  });
};

export const useAdminCreatePost = ({ mutationConfig }: UseCreatePostOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = mutationConfig || {};

  return useMutation({
    onSuccess: async (data, ...args) => {
      /* ---------- admin list ---------- */
      queryClient.setQueriesData<InfiniteData<{ posts: Post[] }>>(
        { queryKey: postQueryKeys.admin.lists() },
        (old) => prependPostToInfiniteData(old, data),
      );

      /* ---------- featured ---------- */
      if (data.isFeatured) {
        queryClient.setQueriesData<InfiniteData<{ posts: Post[] }>>(
          { queryKey: postQueryKeys.admin.featured() },
          (old) => prependPostToInfiniteData(old, data),
        );
      }

      /* ---------- my posts ---------- */
      queryClient.setQueriesData<InfiniteData<{ posts: Post[] }>>(
        { queryKey: postQueryKeys.admin.my_posts() },
        (old) => prependPostToInfiniteData(old, data),
      );

      onSuccess?.(data, ...args);
    },
    ...rest,
    mutationFn: async (createPostData: CreatePost) => {
      const formData = mapCreatePostToDto(createPostData);
      const raw = await createPost(formData);
      const response = CreatePostResponseSchema.parse(raw);
      return mapPostDtoToEntity(response.post);
    },
  });
};

const prependPostToInfiniteData = <T extends { id: string }>(
  data: InfiniteData<{ posts: T[] }> | undefined,
  post: T,
) => {
  if (!data) return data;

  return {
    ...data,
    pages: data.pages.map((page, index) =>
      index === 0 ? { ...page, posts: [post, ...page.posts] } : page,
    ),
  };
};
