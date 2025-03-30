export const Roles = {
  ADMIN: "ADMIN",
  EMPLOYEE: "EMPLOYEE",
  CUSTOMER: "CUSTOMER"
} as const
export type RolesType = keyof typeof Roles 

export const StatusUser = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  BLOCKED: "BLOCKED"
} as const
export type StatusUserType = keyof typeof StatusUser;
