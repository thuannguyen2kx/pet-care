import z from 'zod';

import { mongoObjectIdSchema } from '@/shared/lib/zod-primitives';

export const VisibilitySchema = z.enum(['public', 'private']);

export const PostStatusSchema = z.enum(['active', 'inactive', 'pending', 'rejected']);
const ReactionTypeSchema = z.enum(['like', 'love', 'laugh', 'sad', 'angry']);
// ====================
// Request to API
// ====================
export const PostsQuerySchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
});

export const AddReactionDtoSchema = z.object({
  reactionType: ReactionTypeSchema,
});
// ====================
// Response from API
// ====================
export const PostDtoSchema = z.object({
  _id: mongoObjectIdSchema,

  authorId: z.object({
    _id: mongoObjectIdSchema,
    fullName: z.string(),
    profilePicture: z.object({
      url: z.string().url(),
      publicId: z.string().nullable(),
    }),
  }),

  title: z.string().optional(),
  content: z.string(),
  tags: z.array(z.string()),
  petIds: z.array(mongoObjectIdSchema),

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
      url: z.url(),
      publicId: z.string(),
      type: z.enum(['image', 'video']),
    }),
  ),

  reports: z.array(z.unknown()),
  moderationNotes: z.array(z.unknown()),

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
  createdAt: z.string(),
  updatedAt: z.string(),
  __v: z.number(),
});
export const PostsPaginationDtoSchema = z.object({
  totalPosts: z.number(),
  totalPages: z.number(),
  currentPage: z.number(),
  hasNextPage: z.boolean(),
  hasPrevPage: z.boolean(),
});

// ====================
// Types
// ====================
export type PostsQuery = z.infer<typeof PostsQuerySchema>;
export type PostDto = z.infer<typeof PostDtoSchema>;
export type PostsPaginationDto = z.infer<typeof PostsPaginationDtoSchema>;
