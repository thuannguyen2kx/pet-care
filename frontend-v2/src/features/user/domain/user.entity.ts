import { z } from 'zod';

export const UserStatusSchema = z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'DELETED']);

export const UserGenderSchema = z.enum(['MALE', 'FEMALE']);

export type UserStatus = z.infer<typeof UserStatusSchema>;
export type UserGender = z.infer<typeof UserGenderSchema>;

export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
  DELETED: 'DELETED',
} as const;

export const USER_GENDER = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
} as const;
