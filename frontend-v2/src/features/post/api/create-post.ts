import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { postQueryKeys } from '@/features/post/api/query-keys';
import type { CreatePost } from '@/features/post/domain/post.state';
import { mapCreatePostToDto } from '@/features/post/domain/post.transform';
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
  mutationConfig?: UseMutationOptions<unknown, unknown, CreatePost, unknown>;
};
export const useCreatePost = ({ mutationConfig }: UseCreatePostOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = mutationConfig || {};

  return useMutation({
    onSuccess: async (...args) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: postQueryKeys.customer.lists() }),
        onSuccess?.(...args),
      ]);
    },
    ...rest,
    mutationFn: (createPostData: CreatePost) => {
      const formData = mapCreatePostToDto(createPostData);
      return createPost(formData);
    },
  });
};
