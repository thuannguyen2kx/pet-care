import type { AdminPostsQuery, CustomerPostsQuery } from '@/features/post/domain/post.state';

export const postQueryKeys = {
  root: ['posts'] as const,

  customer: {
    root: () => [...postQueryKeys.root, 'customer'] as const,
    lists: () => [...postQueryKeys.customer.root(), 'list'] as const,
    list: (params: CustomerPostsQuery) => [...postQueryKeys.customer.lists(), params] as const,
    featured: () => [...postQueryKeys.customer.root(), 'featured'] as const,
    detail: (id: string) => [...postQueryKeys.customer.root(), 'detail', id] as const,
    my_posts: () => [...postQueryKeys.customer.root(), 'my-posts'] as const,
  },
  admin: {
    root: () => [...postQueryKeys.root, 'admin'] as const,
    posts: () => [...postQueryKeys.admin.root(), 'posts'] as const,
    lists: () => [...postQueryKeys.admin.posts(), 'list'] as const,
    list: (params: AdminPostsQuery) => [...postQueryKeys.admin.lists(), params] as const,
    featured: () => [...postQueryKeys.admin.posts(), 'featured'] as const,
    my_posts: () => [...postQueryKeys.admin.posts(), 'my-posts'] as const,
    detail: (id: string) => [...postQueryKeys.admin.posts(), 'detail', id] as const,
  },
};
