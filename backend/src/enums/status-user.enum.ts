export const StatusUser = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  BLOCKED: "BLOCKED"
} as const
export type StatusUserType = keyof typeof StatusUser;