import { MessageCircle } from 'lucide-react';

import { ReactionPicker } from '@/features/reaction/components/reaction-picker';
import { getReactionMeta } from '@/features/reaction/config';
import type { ReactionType } from '@/features/reaction/domain/reaction-entity';
import { Button } from '@/shared/ui/button';

interface PostReactionsProps {
  reactions: Record<ReactionType, number>;
  totalReactions: number;
  userReaction: ReactionType | null;
  comments: number;
  onReactionChange: (reactionType: ReactionType) => void;
  onComment: () => void;
}
export function PostReactions({
  reactions,
  totalReactions,
  userReaction,
  comments,
  onReactionChange,
  onComment,
}: PostReactionsProps) {
  // Get non-zero reactions for display
  const activeReactions = Object.entries(reactions)
    .filter(([, r]) => r > 0)
    .sort((a, b) => b[1] - a[1]);

  return (
    <div className="border-border/50 border-t pt-6">
      {/* Reaction counts summary - click to show who reacted */}
      {totalReactions > 0 && (
        <div className="text-muted-foreground mb-4 flex items-center gap-2 text-sm">
          <div className="flex -space-x-1">
            {activeReactions.slice(0, 3).map(([type]) => (
              <span key={type} className="text-lg">
                {getReactionMeta(type as ReactionType).emoji}
              </span>
            ))}
          </div>
          <span className="text-xs">{totalReactions} tương tác</span>
        </div>
      )}

      <div className="flex items-center gap-4">
        <ReactionPicker currentReaction={userReaction} onReactionSelect={onReactionChange} />

        <Button variant="ghost" size="sm" onClick={onComment}>
          <MessageCircle size={20} />
          <span className="text-sm font-medium">{comments}</span>
        </Button>
      </div>
    </div>
  );
}
