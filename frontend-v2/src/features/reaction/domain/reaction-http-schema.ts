import z from 'zod';

import { ReactionDtoSchema } from '@/features/reaction/domain/reaction.dto';

export const AddReactionResponseSchema = z.object({
  reaction: ReactionDtoSchema,
});
