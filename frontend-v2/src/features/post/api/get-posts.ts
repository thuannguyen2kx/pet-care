import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';
import type { AxiosRequestConfig } from 'axios';

import { postQueryKeys } from '@/features/post/api/query-keys';
import { GetPostsResponseDtoSchema } from '@/features/post/domain/post-http-schema';
import type { CustomerPostsQuery } from '@/features/post/domain/post.state';
import {
  mapCustomerPostQueryToDto,
  mapPostsDtoToEntities,
} from '@/features/post/domain/post.transform';
import { POST_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { QueryConfig } from '@/shared/lib/react-query';

const getPosts = (config: AxiosRequestConfig) => {
  return http.get(POST_ENDPOINTS.LIST, config);
};

export const getPostsInfiniteQueryOptions = (query: CustomerPostsQuery) => {
  return infiniteQueryOptions({
    queryKey: postQueryKeys.customer.list(query),
    queryFn: async ({ pageParam = 1, signal }) => {
      const queryDto = mapCustomerPostQueryToDto({
        ...query,
        page: pageParam as number,
      });
      const config = { signal, params: queryDto };
      const raw = await getPosts(config);
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

type UsePostsOptions = {
  query: CustomerPostsQuery;
  queryConfig?: QueryConfig<typeof getPostsInfiniteQueryOptions>;
};

export const usePosts = ({ query, queryConfig }: UsePostsOptions) => {
  return useInfiniteQuery({
    ...getPostsInfiniteQueryOptions(query),
    ...queryConfig,
  });
};
