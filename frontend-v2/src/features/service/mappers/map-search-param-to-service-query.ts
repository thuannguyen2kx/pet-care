/* eslint-disable @typescript-eslint/no-explicit-any */
// map-search-params-to-service-query.ts

import type { TServiceQueryPayload } from '@/features/service/api/types';

export function mapSearchParamsToServiceQuery(searchParams: URLSearchParams): TServiceQueryPayload {
  return {
    search: searchParams.get('search') || undefined,
    category: searchParams.get('category') || undefined,
    isActive:
      searchParams.get('isActive') === 'true'
        ? true
        : searchParams.get('isActive') === 'false'
          ? false
          : undefined,
    sortBy: (searchParams.get('sortBy') as any) || 'updatedAt',
    sortOrder: (searchParams.get('sortOrder') as any) || 'desc',
    page: Number(searchParams.get('page') || 1),
    limit: Number(searchParams.get('limit') || 10),
  };
}
