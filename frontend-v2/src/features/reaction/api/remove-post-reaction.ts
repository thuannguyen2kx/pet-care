import {
  useMutation,
  useQueryClient,
  type InfiniteData,
  type UseMutationOptions,
} from '@tanstack/react-query';

import { postQueryKeys } from '@/features/post/api/query-keys';
import type { Post } from '@/features/post/domain/post.entity';
import { POST_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';

const removePostReaction = (postId: string) => {
  return http.delete(POST_ENDPOINTS.REACTION(postId));
};

type PostsInfiniteData = InfiniteData<{ posts: Post[] }>;
type MutationContext = {
  previousData: [readonly unknown[], PostsInfiniteData | undefined][];
};
type UseRemovePostReaction = {
  mutationConfig?: UseMutationOptions<unknown, unknown, string, MutationContext>;
};
export const useRemovePostReaction = ({ mutationConfig }: UseRemovePostReaction) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    mutationFn: (postId: string) => {
      return removePostReaction(postId);
    },
    onMutate: async (postId) => {
      const queryKey = postQueryKeys.customer.lists();
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueriesData<PostsInfiniteData>({
        queryKey: postQueryKeys.customer.lists(),
      });

      queryClient.setQueriesData<PostsInfiniteData>({ queryKey }, (old) =>
        updatePostInInfiniteData(old, postId, (post) => {
          const prevReaction = post.reactionSummary.userReaction;
          if (!prevReaction) return post;

          const counts = { ...post.reactionSummary.byType };

          counts[prevReaction] = Math.max(0, counts[prevReaction] - 1);

          return {
            ...post,
            reactionSummary: {
              total: Math.max(0, post.reactionSummary.total - 1),
              byType: counts,
              userReaction: null,
            },
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

    onSuccess(data, postId, onMutateResult, context) {
      onSuccess?.(data, postId, onMutateResult, context);
    },
    ...restConfig,
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
