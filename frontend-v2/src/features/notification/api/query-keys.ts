export const notificationKeys = {
  all: ['notifications'],
  customer: {
    root: () => [...notificationKeys.all, 'customer'] as const,
    list: () => [...notificationKeys.customer.root(), 'list'] as const,
    count_unread: () => [...notificationKeys.customer.root(), 'count_unread'] as const,
  },
  employee: {
    root: () => [...notificationKeys.all, 'employee'] as const,
    list: () => [...notificationKeys.employee.root(), 'list'] as const,
    count_unread: () => [...notificationKeys.employee.root(), 'count_unread'] as const,
  },
  admin: {
    root: () => [...notificationKeys.all, 'admin'] as const,
    list: () => [...notificationKeys.admin.root(), 'list'] as const,
    count_unread: () => [...notificationKeys.admin.root(), 'count_unread'] as const,
  },
};
