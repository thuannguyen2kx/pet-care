export const petQueryKeys = {
  all: ['pets'],
  customer: {
    root: () => [...petQueryKeys.all, 'customer'] as const,
    list: () => [...petQueryKeys.customer.root(), 'list'] as const,
    details: () => [...petQueryKeys.customer.root(), 'details'] as const,
    detail: (id: string) => [...petQueryKeys.customer.details(), id] as const,
  },
};
