import { useCallback, useState } from 'react';

import {
  CustomerPostsQuerySchema,
  type CustomerPostsQuery,
} from '@/features/post/domain/post.state';

export const usePostsQuery = () => {
  const [query, setQuery] = useState<CustomerPostsQuery>(() => CustomerPostsQuerySchema.parse({}));

  const updateQuery = useCallback((next: Partial<CustomerPostsQuery>) => {
    setQuery((prev) => CustomerPostsQuerySchema.parse({ ...prev, ...next }));
  }, []);

  return {
    query,
    updateQuery,
  };
};
