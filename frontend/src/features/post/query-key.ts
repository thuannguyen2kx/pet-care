import { PostQueryParams } from "./types/api.types";

export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (params: PostQueryParams) => [...postKeys.lists(), params] as const,
  infinite: (filters: PostQueryParams) => [...postKeys.lists(), 'infinite', { ...filters }] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
  featured: () => [...postKeys.all, 'featured'] as const,
  myPosts: () => [...postKeys.all, 'my-posts'] as const,
  moderation: () => [...postKeys.all, 'moderation'] as const,
  reported: () => [...postKeys.all, 'reported'] as const,
  userPosts: (userId: string) => [...postKeys.all, 'user', userId] as const,
};