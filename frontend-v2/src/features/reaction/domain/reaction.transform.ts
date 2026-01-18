import type { AddReactionDto } from '@/features/reaction/domain/reaction.dto';
import type { AddReaction } from '@/features/reaction/domain/reaction.state';

// =======================
// State => Dto
// ========================
export const mapAddReactionToDto = (state: AddReaction): AddReactionDto => {
  return {
    reactionType: state.reactionType,
  };
};
