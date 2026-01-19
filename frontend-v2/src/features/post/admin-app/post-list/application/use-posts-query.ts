import { useCallback, useState } from 'react';

import { AdminPostsQuerySchema, type AdminPostsQuery } from '@/features/post/domain/post.state';

export const useAdminPostsQuery = () => {
  const [query, setQuery] = useState<AdminPostsQuery>(() => AdminPostsQuerySchema.parse({}));

  const updateQuery = useCallback((next: Partial<AdminPostsQuery>) => {
    setQuery((prev) => AdminPostsQuerySchema.parse({ ...prev, ...next }));
  }, []);

  return {
    query,
    updateQuery,
  };
};
