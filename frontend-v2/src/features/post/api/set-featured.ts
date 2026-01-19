import {
  useMutation,
  useQueryClient,
  type InfiniteData,
  type UseMutationOptions,
} from '@tanstack/react-query';

import { postQueryKeys } from '@/features/post/api/query-keys';
import type { SetPostFeaturedDto } from '@/features/post/domain/post.dto';
import type { Post } from '@/features/post/domain/post.entity';
import type { SetPostFeatured } from '@/features/post/domain/post.state';
import { mapSetPostFeaturedToDto } from '@/features/post/domain/post.transform';
import { POST_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';

const setPostFeatured = ({
  postId,
  setPostFeaturedDto,
}: {
  postId: string;
  setPostFeaturedDto: SetPostFeaturedDto;
}) => {
  return http.put(POST_ENDPOINTS.SET_FEATURE(postId), setPostFeaturedDto);
};

type PostsInfiniteData = InfiniteData<{ posts: Post[] }>;
type MutationContext = {
  previousData: [readonly unknown[], PostsInfiniteData | undefined][];
};
type UseSetPostFeatured = {
  mutationConfig?: UseMutationOptions<unknown, unknown, SetPostFeatured, MutationContext>;
};

export const useSetPostFeatured = ({ mutationConfig }: UseSetPostFeatured = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};
  const queryClient = useQueryClient();
  return useMutation({
    ...restConfig,
    mutationFn: (setPostFeaturedData: SetPostFeatured) => {
      const setPostFeaturedDto = mapSetPostFeaturedToDto(setPostFeaturedData);
      return setPostFeatured({ postId: setPostFeaturedData.postId, setPostFeaturedDto });
    },
    onMutate: async (variables) => {
      const { postId, featured } = variables;
      const queryKey = postQueryKeys.admin.posts();
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueriesData<PostsInfiniteData>({
        queryKey: postQueryKeys.admin.posts(),
      });

      queryClient.setQueriesData<InfiniteData<{ posts: Post[] }>>({ queryKey }, (old) =>
        updatePostInInfiniteData(old, postId, (post) => {
          return {
            ...post,
            isFeatured: featured,
          };
        }),
      );

      return { previousData };
    },
    onError: (_err, _vars, context) => {
      context?.previousData?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
  });
};
const updatePostInInfiniteData = <T extends { id: string }>(
  data: InfiniteData<{ posts: T[] }> | undefined,
  postId: string,
  updater: (post: T) => T,
) => {
  if (!data) return data;

  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      posts: page.posts.map((post) => (post.id === postId ? updater(post) : post)),
    })),
  };
};
