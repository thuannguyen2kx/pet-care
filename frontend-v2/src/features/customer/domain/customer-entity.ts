import { z } from 'zod';

import { UserStatusSchema } from '@/features/user/domain/user.entity';
import { mongoObjectIdSchema } from '@/shared/lib/zod-primitives';

export const MembershipTierSchema = z.enum(['BRONZE', 'SILVER', 'GOLD', 'PLATINUM']);

export const ProfilePictureSchema = z.object({
  url: z.url().nullable(),
  publicId: z.string().nullable(),
});

export const CommunicationPreferencesSchema = z.object({
  email: z.boolean(),
  sms: z.boolean(),
  push: z.boolean(),
});

export const CustomerStatsSchema = z.object({
  totalBookings: z.number(),
  completedBookings: z.number(),
  cancelledBookings: z.number(),
  noShowCount: z.number(),
  totalSpent: z.number(),
  averageRating: z.number(),
});

export const CustomerInfoSchema = z.object({
  communicationPreferences: CommunicationPreferencesSchema,
  stats: CustomerStatsSchema,
  loyaltyPoints: z.number(),
  membershipTier: MembershipTierSchema,
  memberSince: z.date(),
  isVip: z.boolean(),
  hasOutstandingBalance: z.boolean(),
});

export const CustomerSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.email(),
  phoneNumber: z.string().nullable(),
  address: z
    .object({
      province: z.string(),
      ward: z.string(),
    })
    .nullable(),
  profilePicture: ProfilePictureSchema,
  dateOfBirth: z.string().nullable(),

  status: UserStatusSchema,
  emailVerified: z.boolean(),
  phoneVerified: z.boolean(),
  twoFactorEnabled: z.boolean(),

  customerInfo: CustomerInfoSchema,

  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CustomerListItemSchema = z.object({
  id: mongoObjectIdSchema,
  fullName: z.string(),
  email: z.email(),
  status: UserStatusSchema,
  phoneNumber: z.string().nullable(),
  profilePicture: z.url().nullable(),
  customerInfo: CustomerInfoSchema,
});

/* =====================
 * Types
 * ===================== */
export type Customer = z.infer<typeof CustomerSchema>;
export type CustomerListItem = z.infer<typeof CustomerListItemSchema>;
export type MembershipTier = z.infer<typeof MembershipTierSchema>;
// =====================
// Constant
// =====================
export const MEMBER_SHIP_TIER = {
  BRONZE: 'BRONZE',
  SILVER: 'SILVER',
  GOLD: 'GOLD',
  PLATINUM: 'PLATINUM',
} as const;
