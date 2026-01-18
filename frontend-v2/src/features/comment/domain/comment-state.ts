import z from 'zod';

import { mongoObjectIdSchema } from '@/shared/lib/zod-primitives';

export const AddCommentSchema = z.object({
  postId: mongoObjectIdSchema,
  content: z
    .string()
    .min(1, 'Vui lòng nhập nội dung')
    .max(1000, 'Nội dung bình luận tối đa 1000 ký tự'),
});

export const CommentsQuerySchema = z.object({
  postId: mongoObjectIdSchema,
  limit: z.coerce.number().min(1).max(100).optional().default(10),
});

export type AddComment = z.infer<typeof AddCommentSchema>;
export type CommentsQuery = z.infer<typeof CommentsQuerySchema>;
