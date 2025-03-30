export const StatusUser = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  BLOCKED: "BLOCKED"
} as const
export type StatusUserType = keyof typeof StatusUser;

export const GENDER = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER"
} as const
export type GenderType = keyof typeof GENDER
