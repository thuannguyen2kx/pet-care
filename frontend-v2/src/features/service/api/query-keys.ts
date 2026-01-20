import type { ServicesQuery } from '@/features/service/domain/serivice.state';

export const serviceQueryKeys = {
  all: ['services'],
  customer: {
    root: () => [...serviceQueryKeys.all, 'customer'],
    lists: () => [...serviceQueryKeys.customer.root(), 'list'],
    list: (params: ServicesQuery) => [...serviceQueryKeys.customer.lists(), params],
    detail: (id: string) => [...serviceQueryKeys.customer.root(), 'detail', id],
  },

  admin: {
    root: () => [...serviceQueryKeys.all, 'admin'],
    lists: () => [...serviceQueryKeys.admin.root(), 'list'],
    list: (params: ServicesQuery) => [...serviceQueryKeys.admin.lists(), params],
    detail: (id: string) => [...serviceQueryKeys.admin.root(), 'detail', id],
  },
};
