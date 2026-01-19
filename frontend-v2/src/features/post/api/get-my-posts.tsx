import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';
import type { AxiosRequestConfig } from 'axios';

import { postQueryKeys } from '@/features/post/api/query-keys';
import { GetPostsResponseDtoSchema } from '@/features/post/domain/post-http-schema';
import { mapPostsDtoToEntities } from '@/features/post/domain/post.transform';
import { POST_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { QueryConfig } from '@/shared/lib/react-query';

const getMyPosts = (config: AxiosRequestConfig) => {
  return http.get(POST_ENDPOINTS.ME, config);
};

export const getMyPostsInfiniteQueryOptions = () => {
  return infiniteQueryOptions({
    queryKey: postQueryKeys.customer.my_posts(),
    queryFn: async ({ pageParam = 1, signal }) => {
      const config = { signal, params: { page: pageParam as number } };
      const raw = await getMyPosts(config);
      const response = GetPostsResponseDtoSchema.parse(raw);
      return {
        posts: mapPostsDtoToEntities(response.posts),
        pagination: response.pagination,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination.hasNextPage) return undefined;
      return lastPage.pagination.currentPage + 1;
    },
  });
};

type UseMyPostsOptions = {
  queryConfig?: QueryConfig<typeof getMyPostsInfiniteQueryOptions>;
};

export const useMyPosts = ({ queryConfig }: UseMyPostsOptions = {}) => {
  return useInfiniteQuery({
    ...getMyPostsInfiniteQueryOptions(),
    ...queryConfig,
  });
};

export const getAdminMyPostsInfiniteQueryOptions = () => {
  return infiniteQueryOptions({
    queryKey: postQueryKeys.admin.my_posts(),
    queryFn: async ({ pageParam = 1, signal }) => {
      const config = { signal, params: { page: pageParam as number } };
      const raw = await getMyPosts(config);
      const response = GetPostsResponseDtoSchema.parse(raw);
      return {
        posts: mapPostsDtoToEntities(response.posts),
        pagination: response.pagination,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination.hasNextPage) return undefined;
      return lastPage.pagination.currentPage + 1;
    },
  });
};

type UseAdminMyPostsOptions = {
  queryConfig?: QueryConfig<typeof getAdminMyPostsInfiniteQueryOptions>;
};

export const useAdminMyPosts = ({ queryConfig }: UseAdminMyPostsOptions = {}) => {
  return useInfiniteQuery({
    ...getAdminMyPostsInfiniteQueryOptions(),
    ...queryConfig,
  });
};
