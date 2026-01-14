import { z } from 'zod';
export const UpdateProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  phoneNumber: z.string().optional(),
  dateOfBirth: z.date().nullable(),
  address: z
    .object({
      province: z.string(),
      ward: z.string(),
    })
    .optional(),
});

export type UpdateProfile = z.infer<typeof UpdateProfileSchema>;
