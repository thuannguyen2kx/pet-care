import z from 'zod';

export const existingMediaSchema = z.object({
  id: z.string(),
  url: z.url(),
  type: z.enum(['image', 'video']),
});

export const newMediaSchema = z.object({
  file: z.instanceof(File),
  previewUrl: z.string(),
});

export const mediaFieldSchema = z.object({
  existing: z.array(existingMediaSchema),
  added: z.array(newMediaSchema),
});

export const CreatePostSchema = z.object({
  title: z.string().optional(),
  content: z.string().nonempty('Vui lòng nhập nội dung bài viết'),
  tags: z.array(z.object({ value: z.string() })).optional(),
  petIds: z.string().optional(),
  visibility: z.enum(['public', 'private']).default('public'),
  media: mediaFieldSchema.optional(),
});

export const CustomerPostsQuerySchema = z.object({
  limit: z.coerce.number().optional().default(10),
});

export const AdminPostsQuerySchema = z.object({
  limit: z.coerce.number().optional().default(10),
});

export type CreatePost = z.infer<typeof CreatePostSchema>;
export type MediaField = z.infer<typeof mediaFieldSchema>;
export type CustomerPostsQuery = z.infer<typeof CustomerPostsQuerySchema>;
export type AdminPostsQuery = z.infer<typeof AdminPostsQuerySchema>;
