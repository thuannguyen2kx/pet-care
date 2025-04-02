// components/comments/ReactionButton.tsx
import React from 'react';
import { ThumbsUp, Heart, SmilePlus, Frown, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { useUserReaction } from '../hooks/queries/get-user-reaction';
import { useReactions } from '../hooks/queries/get-reactions';
import { useAddReaction } from '../hooks/mutations/add-reaction';
import { useRemoveReaction } from '../hooks/mutations/remove-reaction';
import { ContentType, ReactionItemType} from '../types/api.types';


interface ReactionButtonProps {
  contentType: ContentType;
  contentId: string;
  currentUser?: {
    _id: string;
  };
}

export const ReactionButton: React.FC<ReactionButtonProps> = ({
  contentType,
  contentId,
  currentUser,
}) => {
  // Get current user's reaction if logged in
  const { data: userReactionData } = useUserReaction(contentType, contentId);
  
  // Get all reactions and counts
  const { data: reactionsData } = useReactions(contentType, contentId);
  
  // Add and remove reaction mutations
  const addReactionMutation = useAddReaction();
  const removeReactionMutation = useRemoveReaction();
  
  const userReaction = userReactionData?.reaction;
  const counts = reactionsData?.counts || { like: 0, love: 0, laugh: 0, sad: 0, angry: 0, total: 0 };
  
  const handleReaction = (reactionType: ReactionItemType) => {
    if (!currentUser) {
      // Handle not logged in case (redirect to login)
      return;
    }
    
    // If user already has this reaction, remove it
    if (userReaction?.reactionType === reactionType) {
      removeReactionMutation.mutate({
        contentType,
        contentId
      });
    } else {
      // Add or update reaction
      addReactionMutation.mutate({
        contentType,
        contentId,
        reactionType
      });
    }
  };
  
  // Reaction icons with appropriate styling based on user's current reaction
  const reactionIcons: Record<ReactionItemType,React.JSX.Element> = {
    like: <ThumbsUp className={userReaction?.reactionType === 'like' ? 'fill-primary' : 'fill-none'} size={18} />,
    love: <Heart className={userReaction?.reactionType === 'love' ? 'fill-red-500' : 'fill-none'} size={18} />,
    laugh: <SmilePlus className={userReaction?.reactionType === 'laugh' ? 'fill-yellow-500' : 'fill-none'} size={18} />,
    sad: <Frown className={userReaction?.reactionType === 'sad' ? 'fill-blue-500' : 'fill-none'} size={18} />,
    angry: <Award className={userReaction?.reactionType === 'angry' ? 'fill-orange-500' : 'fill-none'} size={18} />
  };
  
  // Labels for each reaction type
  const reactionLabels: Record<ReactionItemType, string> = {
    like: 'Like',
    love: 'Love',
    laugh: 'Haha',
    sad: 'Sad',
    angry: 'Angry'
  };
  
  return (
    <div className="flex items-center space-x-1">
      <TooltipProvider>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center space-x-2"
            >
              {userReaction ? reactionIcons[userReaction.reactionType] : <ThumbsUp size={18} />}
              <span>{counts.total > 0 && counts.total}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <div className="flex p-1">
              {(Object.keys(reactionIcons) as ReactionItemType[]).map((type) => (
                <Tooltip key={type}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReaction(type)}
                      className="m-0 p-2"
                      disabled={addReactionMutation.isPending || removeReactionMutation.isPending}
                    >
                      {reactionIcons[type]}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{reactionLabels[type]} ({counts[type]})</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </TooltipProvider>
    </div>
  );
};