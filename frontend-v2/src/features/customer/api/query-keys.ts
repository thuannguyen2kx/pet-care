export const customerQueryKey = {
  root: ['customer'] as const,

  profile: () => [...customerQueryKey.root, 'profile'] as const,
};
