import { z } from 'zod';

export const ReactionTypeSchema = z.enum(['like', 'love', 'laugh', 'sad', 'angry']);
export type ReactionType = z.infer<typeof ReactionTypeSchema>;
