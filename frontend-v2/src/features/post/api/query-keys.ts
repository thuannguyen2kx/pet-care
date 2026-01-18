import type { CustomerPostsQuery } from '@/features/post/domain/post.state';

export const postQueryKeys = {
  root: ['posts'] as const,

  customer: {
    root: () => [...postQueryKeys.root, 'customer'] as const,
    lists: () => [...postQueryKeys.customer.root(), 'list'] as const,
    list: (params: CustomerPostsQuery) => [...postQueryKeys.customer.lists(), params] as const,
    detail: (id: string) => [...postQueryKeys.customer.root(), 'detail', id] as const,
  },
};
