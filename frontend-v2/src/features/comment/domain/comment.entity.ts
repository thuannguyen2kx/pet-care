import z from 'zod';

import { mongoObjectIdSchema } from '@/shared/lib/zod-primitives';

export type Comment = {
  id: string;
  postId: string;
  author: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
  };
  content: string;
  stats: {
    likeCount: number;
    replyCount: number;
  };
  replies: Comment[];
  createdAt: Date;
  updatedAt: Date;
};

export const CommentSchema: z.ZodType<Comment> = z.lazy(() =>
  z.object({
    id: mongoObjectIdSchema,
    postId: mongoObjectIdSchema,
    author: z.object({
      id: mongoObjectIdSchema,
      fullName: z.string(),
      avatarUrl: z.string().nullable(),
    }),
    content: z.string(),
    stats: z.object({
      likeCount: z.number(),
      replyCount: z.number(),
    }),
    replies: z.array(CommentSchema),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
);
