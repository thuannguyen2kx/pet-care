import type { CommentsQuery } from '@/features/comment/domain/comment-state';

export const commentQueryKeys = {
  all: ['comments'] as const,

  post: (postId: string) => [...commentQueryKeys.all, 'post', postId] as const,

  list: (query: CommentsQuery) => [...commentQueryKeys.post(query.postId), 'list', query] as const,
};
