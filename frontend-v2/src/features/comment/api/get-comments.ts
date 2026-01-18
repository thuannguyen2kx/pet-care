import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';
import type { AxiosRequestConfig } from 'axios';

import { commentQueryKeys } from '@/features/comment/api/query-keys';
import { CommentsResponseDtoSchema } from '@/features/comment/domain/comment-http-schema';
import type { CommentsQuery } from '@/features/comment/domain/comment-state';
import {
  mapCommentsDtoToEntities,
  mapCommentsQueryToDto,
} from '@/features/comment/domain/comment.transform';
import { POST_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { QueryConfig } from '@/shared/lib/react-query';

const getComments = ({ postId, config }: { postId: string; config: AxiosRequestConfig }) => {
  return http.get(POST_ENDPOINTS.COMMENTS(postId), config);
};

export const getCommentsQueryOptions = (query: CommentsQuery) => {
  return infiniteQueryOptions({
    queryKey: commentQueryKeys.list(query),
    queryFn: async ({ pageParam, signal }) => {
      const queryDto = mapCommentsQueryToDto({ ...query, page: pageParam as number });
      const config = { signal, params: queryDto };
      const raw = await getComments({ postId: query.postId, config });
      const response = CommentsResponseDtoSchema.parse(raw);
      return {
        comments: mapCommentsDtoToEntities(response.comments),
        pagination: response.pagination,
      };
    },
    getPreviousPageParam: (firstPage) => {
      const prevPage = firstPage.pagination.page - 1;
      if (prevPage < 1) {
        return undefined;
      }
      return prevPage;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination.hasNextPage) return undefined;
      return lastPage.pagination.page + 1;
    },
  });
};

type UseCommentsOptions = {
  query: CommentsQuery;
  queryConfig?: QueryConfig<typeof getCommentsQueryOptions>;
};

export const useComments = ({ query, queryConfig }: UseCommentsOptions) => {
  return useInfiniteQuery({
    ...getCommentsQueryOptions(query),
    ...queryConfig,
  });
};
