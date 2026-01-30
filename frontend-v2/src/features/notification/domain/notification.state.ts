import z from 'zod';

export const NotificationQuerySchema = z.object({
  limit: z.coerce.number().optional().default(20),
  cursor: z.string().optional(),
});

export type NotificationQuery = z.infer<typeof NotificationQuerySchema>;
