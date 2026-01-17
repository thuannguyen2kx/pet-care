import type { CustomersQuery } from '@/features/customer/domain/customer-state';

export const customerQueryKey = {
  root: ['customer'] as const,

  profile: () => [...customerQueryKey.root, 'profile'] as const,

  admin: () => [...customerQueryKey.root, 'admin'] as const,
  admin_customers: () => [...customerQueryKey.admin(), 'customers'] as const,
  admin_customer: (params: CustomersQuery) =>
    [...customerQueryKey.admin_customers(), params] as const,
};
