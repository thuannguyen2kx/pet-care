// service.query-key.ts

import type { TServiceQueryPayload } from '@/features/service/types';

export const serviceQueryKey = {
  root: ['services'] as const,

  // ===== LISTS =====
  lists: () => [...serviceQueryKey.root, 'list'] as const,

  list: (query: TServiceQueryPayload) => [...serviceQueryKey.lists(), query] as const,

  // ===== DETAIL =====
  details: () => [...serviceQueryKey.root, 'detail'] as const,

  detail: (id: string) => [...serviceQueryKey.details(), id] as const,

  // ===== ADMIN =====
  admin: () => [...serviceQueryKey.root, 'admin'] as const,

  adminLists: () => [...serviceQueryKey.admin(), 'list'] as const,

  adminList: (query: TServiceQueryPayload) => [...serviceQueryKey.adminLists(), query] as const,

  adminDetail: (id: string) => [...serviceQueryKey.admin(), 'detail', id] as const,

  // ===== STATS =====
  statistics: () => [...serviceQueryKey.root, 'statistics'] as const,

  // ===== CUSTOMER =====
  customer: () => [...serviceQueryKey.root, 'customer'] as const,
  customerLists: () => [...serviceQueryKey.customer(), 'list'] as const,
  customerList: (query: TServiceQueryPayload) =>
    [...serviceQueryKey.customerLists(), query] as const,
};
