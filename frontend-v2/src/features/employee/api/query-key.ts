// @/features/employee/api/query-keys.ts

import type { TEmployeeFilter } from '@/features/employee/shemas';

export const employeeKeys = {
  all: ['employees'] as const,
  lists: () => [...employeeKeys.all, 'list'] as const,
  list: (filter: TEmployeeFilter) => [...employeeKeys.lists(), filter] as const,
  details: () => [...employeeKeys.all, 'detail'] as const,
  detail: (id: string) => [...employeeKeys.details(), id] as const,
};
