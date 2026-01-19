import type { Post } from '@/features/post/domain/post.entity';
import { useAddPostReaction } from '@/features/reaction/api/add-post-reaction';
import { useRemovePostReaction } from '@/features/reaction/api/remove-post-reaction';
import type { ReactionType } from '@/features/reaction/domain/reaction-entity';

export const usePostReactionController = (post: Post) => {
  const add = useAddPostReaction({});
  const remove = useRemovePostReaction({});

  const onReact = (type: ReactionType) => {
    if (post.reactionSummary.userReaction === type) {
      remove.mutate(post.id);
    } else {
      add.mutate({ contentId: post.id, reactionType: type });
    }
  };

  return { onReact };
};
