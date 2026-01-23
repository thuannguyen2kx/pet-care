import z from 'zod';

import { ReactionTypeSchema } from '@/features/reaction/domain/reaction-entity';
import { mongoObjectIdSchema } from '@/shared/lib/zod-primitives';

const VisibilitySchema = z.enum(['public', 'private']);

const PostStatusSchema = z.enum(['active', 'inactive', 'pending', 'rejected']);

export const PostSchema = z.object({
  id: mongoObjectIdSchema,

  author: z.object({
    id: mongoObjectIdSchema,
    fullName: z.string(),
    avatarUrl: z.url().nullable(),
  }),

  title: z.string().optional(),
  content: z.string(),
  tags: z.array(z.string()),
  petIds: z
    .array(
      z.object({
        id: mongoObjectIdSchema,
        name: z.string(),
        breed: z.string(),
      }),
    )
    .optional(),

  visibility: VisibilitySchema,
  status: PostStatusSchema,
  isFeatured: z.boolean(),

  stats: z.object({
    viewCount: z.number(),
    likeCount: z.number(),
    commentCount: z.number(),
    shareCount: z.number(),
    reportCount: z.number(),
  }),

  media: z.array(
    z.object({
      publicId: z.string(),
      url: z.url(),
      type: z.enum(['image', 'video']),
    }),
  ),

  reactionSummary: z.object({
    total: z.number(),
    byType: z.object({
      like: z.number(),
      love: z.number(),
      laugh: z.number(),
      sad: z.number(),
      angry: z.number(),
    }),
    userReaction: ReactionTypeSchema.nullable(),
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Post = z.infer<typeof PostSchema>;
