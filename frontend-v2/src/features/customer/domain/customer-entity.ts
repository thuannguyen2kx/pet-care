import { z } from 'zod';

import { mongoObjectIdSchema } from '@/shared/lib/zod-primitives';

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
  membershipTier: z.enum(['BRONZE', 'SILVER', 'GOLD', 'PLATINUM']),
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

  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']),
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
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']),
  phoneNumber: z.string().nullable(),
  profilePicture: z.url().nullable(),
  customerInfo: CustomerInfoSchema,
});

/* =====================
 * Types
 * ===================== */
export type Customer = z.infer<typeof CustomerSchema>;
export type CustomerListItem = z.infer<typeof CustomerListItemSchema>;
