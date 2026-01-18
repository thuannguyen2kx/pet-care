import {
  useMutation,
  useQueryClient,
  type InfiniteData,
  type UseMutationOptions,
} from '@tanstack/react-query';

import { postQueryKeys } from '@/features/post/api/query-keys';
import type { Post } from '@/features/post/domain/post.entity';
import { AddReactionResponseSchema } from '@/features/reaction/domain/reaction-http-schema';
import type { AddReactionDto, ReactionDto } from '@/features/reaction/domain/reaction.dto';
import type { AddReaction } from '@/features/reaction/domain/reaction.state';
import { mapAddReactionToDto } from '@/features/reaction/domain/reaction.transform';
import { POST_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';

const addPostReaction = ({
  postId,
  addReactionDto,
}: {
  postId: string;
  addReactionDto: AddReactionDto;
}) => {
  return http.post(POST_ENDPOINTS.REACTION(postId), addReactionDto);
};
type PostsInfiniteData = InfiniteData<{ posts: Post[] }>;

type MutationContext = {
  previousData: [readonly unknown[], PostsInfiniteData | undefined][];
};
type UseAddPostReaction = {
  mutationConfig?: UseMutationOptions<ReactionDto, unknown, AddReaction, MutationContext>;
};
export const useAddPostReaction = ({ mutationConfig }: UseAddPostReaction) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    mutationFn: async (addReactionData: AddReaction) => {
      const addReactionDto = mapAddReactionToDto(addReactionData);

      const raw = await addPostReaction({
        postId: addReactionData.contentId,
        addReactionDto,
      });

      const response = AddReactionResponseSchema.parse(raw);
      return response.reaction;
    },
    onMutate: async (variables) => {
      const { contentId, reactionType } = variables;
      const queryKey = postQueryKeys.customer.lists();
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueriesData<PostsInfiniteData>({
        queryKey: postQueryKeys.customer.lists(),
      });

      queryClient.setQueriesData<InfiniteData<{ posts: Post[] }>>({ queryKey }, (old) =>
        updatePostInInfiniteData(old, contentId, (post: Post) => {
          const prevReaction = post.reactionSummary.userReaction;

          const counts = { ...post.reactionSummary.byType };

          // remove old reaction
          if (prevReaction) {
            counts[prevReaction] -= 1;
          }

          // add new reaction
          counts[reactionType] += 1;

          return {
            ...post,
            reactionSummary: {
              total: post.reactionSummary.total + (prevReaction ? 0 : 1),
              byType: counts,
              userReaction: reactionType,
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

    onSuccess(data, variables, onMutateResult, context) {
      onSuccess?.(data, variables, onMutateResult, context);
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
