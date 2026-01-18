import z from 'zod';

import { ReactionTypeSchema } from '@/features/reaction/domain/reaction-entity';
import { mongoObjectIdSchema } from '@/shared/lib/zod-primitives';

export const AddReactionSchema = z.object({
  reactionType: ReactionTypeSchema,
  contentId: mongoObjectIdSchema,
});

export type AddReaction = z.infer<typeof AddReactionSchema>;
