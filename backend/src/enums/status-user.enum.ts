export const UserStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  SUSPENDED: "SUSPENDED",
  DELETED: "DELETED",
} as const;
export type UserStatusType = (typeof UserStatus)[keyof typeof UserStatus];

export const Gender = {
  MALE: "MALE",
  FEMALE: "FEMALE",
} as const;
export type GenderType = (typeof Gender)[keyof typeof Gender];

export const MemberShipTier = {
  BRONZE: "BRONZE",
  SILVER: "SILVER",
  GOLD: "GOLD",
  PLATINUM: "PLATINUM",
} as const;
export type MemberShipTierType =
  (typeof MemberShipTier)[keyof typeof MemberShipTier];
