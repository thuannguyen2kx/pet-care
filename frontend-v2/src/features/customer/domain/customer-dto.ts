import { z } from 'zod';

import { imageDtoSchema } from '@/shared/lib/zod-primitives';

export const CommunicationPreferencesDtoSchema = z.object({
  email: z.boolean(),
  sms: z.boolean(),
  push: z.boolean(),
});

export const CustomerStatsDtoSchema = z.object({
  totalBookings: z.number(),
  completedBookings: z.number(),
  cancelledBookings: z.number(),
  noShowCount: z.number(),
  totalSpent: z.number(),
  averageRating: z.number(),
});

export const CustomerInfoDtoSchema = z.object({
  communicationPreferences: CommunicationPreferencesDtoSchema,
  stats: CustomerStatsDtoSchema,
  loyaltyPoints: z.number(),
  membershipTier: z.enum(['BRONZE', 'SILVER', 'GOLD', 'PLATINUM']),
  memberSince: z.string(), // ISO
  isVip: z.boolean(),
  hasOutstandingBalance: z.boolean(),
});

export const CustomerUserDtoSchema = z.object({
  _id: z.string(),
  fullName: z.string(),
  email: z.email(),
  phoneNumber: z.string().nullable().optional(),
  address: z
    .object({
      province: z.string(),
      ward: z.string(),
    })
    .nullable()
    .optional(),
  dateOfBirth: z.string().nullable().optional(),
  role: z.literal('CUSTOMER'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']),
  emailVerified: z.boolean(),
  emailVerifiedAt: z.string().nullable(),
  phoneVerified: z.boolean(),
  twoFactorEnabled: z.boolean(),
  profilePicture: imageDtoSchema,
  customerInfo: CustomerInfoDtoSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const UpdateCustomerProfileDtoSchema = z.object({
  fullName: z.string().min(2).optional(),
  phoneNumber: z.string().nullable().optional(),
  dateOfBirth: z.string().nullable().optional(),
  address: z
    .object({
      province: z.string().min(1, 'Tỉnh/thành phố là bắt buộc'),
      ward: z.string().min(1, 'Phường/xã là bắt buộc'),
    })
    .nullable()
    .optional(),
});

export type CustomerUserDto = z.infer<typeof CustomerUserDtoSchema>;
export type UpdateCustomerProfileDto = z.infer<typeof UpdateCustomerProfileDtoSchema>;
