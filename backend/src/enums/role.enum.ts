export const Roles = {
  CUSTOMER: "CUSTOMER",
  ADMIN: "ADMIN",
  EMPLOYEE: "EMPLOYEE"
} as const

export type RoleType = keyof typeof Roles