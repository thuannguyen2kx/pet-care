import type { ReactionType } from '@/features/reaction/domain/reaction-entity';

export type ReactionMeta = {
  type: ReactionType;
  emoji: string;
  label: string;
};

export const REACTIONS = [
  { type: 'like', emoji: '👍', label: 'Thíc' },
  { type: 'love', emoji: '❤️', label: 'Yêu thích' },
  { type: 'laugh', emoji: '😂', label: 'Haha' },
  { type: 'sad', emoji: '😢', label: 'Buồn' },
  { type: 'angry', emoji: '😠', label: 'Phẩn nộ' },
] as const satisfies readonly ReactionMeta[];

export const REACTION_EMOJI = Object.fromEntries(REACTIONS.map((r) => [r.type, r.emoji])) as Record<
  ReactionType,
  string
>;
export const REACTION_LABEL = Object.fromEntries(REACTIONS.map((r) => [r.type, r.label])) as Record<
  ReactionType,
  string
>;

export const getReactionMeta = (type: ReactionType) => REACTIONS.find((r) => r.type === type)!;

export const isValidReactionType = (value: string): value is ReactionType =>
  REACTIONS.some((r) => r.type === value);

export const getDefaultReaction = (): ReactionType => 'like';
