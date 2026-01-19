import z from 'zod';

import { PostDtoSchema, PostsPaginationDtoSchema } from '@/features/post/domain/post.dto';

export const GetPostsResponseDtoSchema = z.object({
  posts: z.array(PostDtoSchema),
  pagination: PostsPaginationDtoSchema,
});

export const CreatePostResponseSchema = z.object({
  post: PostDtoSchema,
});
export type GetPostsResponseDto = z.infer<typeof GetPostsResponseDtoSchema>;
