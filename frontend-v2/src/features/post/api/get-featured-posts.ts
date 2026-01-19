import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';
import type { AxiosRequestConfig } from 'axios';

import { postQueryKeys } from '@/features/post/api/query-keys';
import { GetPostsResponseDtoSchema } from '@/features/post/domain/post-http-schema';
import { mapPostsDtoToEntities } from '@/features/post/domain/post.transform';
import { POST_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { QueryConfig } from '@/shared/lib/react-query';

const getFeaturedPosts = (config: AxiosRequestConfig) => {
  return http.get(POST_ENDPOINTS.FEATURED, config);
};

export const getFeaturedPostsInfiniteQueryOptions = () => {
  return infiniteQueryOptions({
    queryKey: postQueryKeys.customer.featured(),
    queryFn: async ({ pageParam = 1, signal }) => {
      const config = { signal, params: { page: pageParam as number } };
      const raw = await getFeaturedPosts(config);
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

type UseFeaturedPostsOptions = {
  queryConfig?: QueryConfig<typeof getFeaturedPostsInfiniteQueryOptions>;
};

export const useFeaturedPosts = ({ queryConfig }: UseFeaturedPostsOptions = {}) => {
  return useInfiniteQuery({
    ...getFeaturedPostsInfiniteQueryOptions(),
    ...queryConfig,
  });
};

export const getAdminFeaturedPostsInfiniteQueryOptions = () => {
  return infiniteQueryOptions({
    queryKey: postQueryKeys.admin.featured(),
    queryFn: async ({ pageParam = 1, signal }) => {
      const config = { signal, params: { page: pageParam as number } };
      const raw = await getFeaturedPosts(config);
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

type UseAdminFeaturedPostsOptions = {
  queryConfig?: QueryConfig<typeof getAdminFeaturedPostsInfiniteQueryOptions>;
};

export const useAdminFeaturedPosts = ({ queryConfig }: UseAdminFeaturedPostsOptions = {}) => {
  return useInfiniteQuery({
    ...getAdminFeaturedPostsInfiniteQueryOptions(),
    ...queryConfig,
  });
};
