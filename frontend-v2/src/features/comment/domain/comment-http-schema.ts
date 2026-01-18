import z from 'zod';

import {
  CommentDtoSchema,
  CommentsPaginatioDtoSchema,
} from '@/features/comment/domain/comment.dto';
export const CommentsResponseDtoSchema = z.object({
  comments: z.array(CommentDtoSchema),
  pagination: CommentsPaginatioDtoSchema,
});
