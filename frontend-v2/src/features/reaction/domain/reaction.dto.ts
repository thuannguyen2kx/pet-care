import z from 'zod';

import { mongoObjectIdSchema } from '@/shared/lib/zod-primitives';

const ReactionTypeSchema = z.enum(['like', 'love', 'laugh', 'sad', 'angry']);

// =========================
// Request to API
// =========================
export const AddReactionDtoSchema = z.object({
  reactionType: ReactionTypeSchema,
});

// =========================
// Response from API
// =========================
export const ReactionDtoSchema = z.object({
  _id: mongoObjectIdSchema,
  contentType: z.enum(['Post', 'Comment']),
  contentId: mongoObjectIdSchema,
  userId: z.object({
    profilePicture: z.object({
      url: z.url().nullable(),
      publicId: z.string().nullable(),
    }),
    _id: mongoObjectIdSchema,
    fullName: z.string(),
  }),
  reactionType: ReactionTypeSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

// ============================
// Types
// ============================
export type AddReactionDto = z.infer<typeof AddReactionDtoSchema>;

export type ReactionDto = z.infer<typeof ReactionDtoSchema>;
