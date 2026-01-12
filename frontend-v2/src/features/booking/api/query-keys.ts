export const bookingQueryKeys = {
  all: ['bookings'] as const,
  admin: {
    all: () => [...bookingQueryKeys.all, 'admin'] as const,

    lists: () => [...bookingQueryKeys.admin.all(), 'list'] as const,
    list: (params?: Record<string, string>) => [...bookingQueryKeys.admin.lists(), params] as const,

    details: () => [...bookingQueryKeys.admin.all(), 'detail'] as const,
    detail: (bookingId: string) => [...bookingQueryKeys.admin.details(), bookingId] as const,
  },
  employee: {
    all: () => [...bookingQueryKeys.all, 'employee'] as const,

    lists: () => [...bookingQueryKeys.employee.all(), 'list'] as const,
    list: (params?: { date?: string }) => [...bookingQueryKeys.employee.lists(), params] as const,

    details: () => [...bookingQueryKeys.employee.all(), 'detail'] as const,
    detail: (bookingId: string) => [...bookingQueryKeys.employee.details(), bookingId] as const,
  },
  customer: {
    all: () => [...bookingQueryKeys.all, 'customer'] as const,

    lists: () => [...bookingQueryKeys.customer.all(), 'list'] as const,
    list: (params?: { status?: string }) => [...bookingQueryKeys.customer.lists(), params] as const,

    details: () => [...bookingQueryKeys.customer.all(), 'detail'] as const,
    detail: (bookingId: string) => [...bookingQueryKeys.customer.details(), bookingId] as const,
  },
};
