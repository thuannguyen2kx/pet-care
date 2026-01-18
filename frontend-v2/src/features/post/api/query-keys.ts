import type { CustomerPostsQuery } from '@/features/post/domain/post.state';

export const postQueryKeys = {
  all: ['posts'],

  customer: {
    lists: () => [...postQueryKeys.all, 'customer', 'list'],
    list: (params: CustomerPostsQuery) => [...postQueryKeys.all, 'customer', 'list', params],
    detail: (id: string) => [...postQueryKeys.all, 'customer', 'detail', id],
  },
};
