export const ROLES = {
  ADMIN: 'ADMIN',
  EMPLOYEE: 'EMPLOYEE',
  CUSTOMER: 'CUSTOMER',
} as const;

export type TRole = (typeof ROLES)[keyof typeof ROLES];
