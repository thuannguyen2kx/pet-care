import z from 'zod';

import { imageDtoSchema, mongoObjectIdSchema } from '@/shared/lib/zod-primitives';

export const AddCommentDtoSchema = {
  content: z
    .string()
    .min(1, 'Vui lòng nhập nội dung')
    .max(1000, 'Nội dung bình luận tối đa 1000 ký tự'),
};

export const CommentsQueryDtoSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
  postId: mongoObjectIdSchema,
  parentId: mongoObjectIdSchema.optional(),
});
// ===================
// Response to API
// ====================
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CommentDtoSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    _id: mongoObjectIdSchema,
    postId: mongoObjectIdSchema,
    authorId: z.object({
      _id: mongoObjectIdSchema,
      fullName: z.string(),
      profilePicture: imageDtoSchema,
    }),
    content: z.string(),
    status: z.enum(['active', 'deleted']),
    stats: z.object({
      likeCount: z.number(),
      replyCount: z.number(),
    }),
    replies: z.array(CommentDtoSchema),
    replyCount: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
);

export const CommentsPaginatioDtoSchema = z.object({
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
  totalItems: z.number(),
  hasNextPage: z.boolean(),
});
// ===================
// Types
// ===================
export type AddCommentDto = z.infer<typeof AddCommentDtoSchema>;
export type CommentsQueryDto = z.infer<typeof CommentsQueryDtoSchema>;
export type CommentDto = z.infer<typeof CommentDtoSchema>;
