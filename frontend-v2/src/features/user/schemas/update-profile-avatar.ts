import z from 'zod';

import { profileImageScheme } from '@/features/user/schemas/atomic/profile-avatar.shema';

export const updateProfileAvatar = z.object({
  profilePicture: profileImageScheme,
});

export type TUpdateProfileAvatar = z.infer<typeof updateProfileAvatar>;
