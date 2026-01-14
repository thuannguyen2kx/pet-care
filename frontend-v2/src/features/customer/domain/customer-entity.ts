import { z } from 'zod';

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

/* =====================
 * Types
 * ===================== */
export type Customer = z.infer<typeof CustomerSchema>;
