import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useUserReaction } from "../hooks/queries/get-user-reaction";
import { useReactions } from "../hooks/queries/get-reactions";
import { useAddReaction } from "../hooks/mutations/add-reaction";
import { useRemoveReaction } from "../hooks/mutations/remove-reaction";
import {
  ContentType,
  ReactionItemType,
} from "@/features/reaction/types/api.types";
import { cn } from "@/lib/utils";

interface ReactionButtonProps {
  contentType: ContentType;
  contentId: string;
  currentUser?: {
    _id: string;
  };
  variant?: "default" | "minimal";
  className?: string;
}

export const ReactionButton: React.FC<ReactionButtonProps> = ({
  contentType,
  contentId,
  currentUser,
  variant = "default",
  className,
}) => {
  // Get current user's reaction if logged in
  const { data: userReactionData } = useUserReaction(contentType, contentId);

  // Get all reactions and counts
  const { data: reactionsData } = useReactions(contentType, contentId);

  // Add and remove reaction mutations
  const addReactionMutation = useAddReaction();
  const removeReactionMutation = useRemoveReaction();

  const userReaction = userReactionData?.reaction;
  const counts = reactionsData?.counts || {
    like: 0,
    love: 0,
    laugh: 0,
    sad: 0,
    angry: 0,
    total: 0,
  };

  const handleReaction = (reactionType: ReactionItemType) => {
    if (!currentUser) {
      // Handle not logged in case
      alert("Vui lòng đăng nhập để thực hiện tính năng này");
      return;
    }

    // If user already has this reaction, remove it
    if (userReaction?.reactionType === reactionType) {
      removeReactionMutation.mutate({
        contentType,
        contentId,
      });
    } else {
      // Add or update reaction
      addReactionMutation.mutate({
        contentType,
        contentId,
        reactionType,
      });
    }
  };

  // Determine the current reaction to show based on user's reaction
  // const currentReaction = userReaction?.reactionType || 'like';

  // Reaction icons with appropriate styling based on user's current reaction
  const reactionIcons: Record<ReactionItemType, string> = {
    like: "👍",
    love: "❤️",
    laugh: "😂",
    sad: "😢",
    angry: "😡",
  };

  // Colors for each reaction type
  const reactionColors: Record<ReactionItemType, string> = {
    like: "text-primary",
    love: "text-red-500",
    laugh: "text-yellow-500",
    sad: "text-blue-500",
    angry: "text-orange-500",
  };

  // Labels for each reaction type
  const reactionLabels: Record<ReactionItemType, string> = {
    like: "Thích",
    love: "Yêu thích",
    laugh: "Haha",
    sad: "Buồn",
    angry: "Wow",
  };

  // Minimal variant - just the icon with hover tooltip
  if (variant === "minimal") {
    return (
      <TooltipProvider>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "p-0 h-auto flex items-center space-x-1",
                userReaction && reactionColors[userReaction.reactionType],
                className
              )}
            >
              {userReaction
                ? reactionIcons[userReaction.reactionType]
                : reactionIcons.like}
              {counts.total > 0 && (
                <span className="text-xs font-medium">{counts.total}</span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <div className="flex p-1">
              {(Object.keys(reactionIcons) as ReactionItemType[]).map(
                (type) => (
                  <Tooltip key={type}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReaction(type)}
                        className="m-0 p-2"
                        disabled={
                          addReactionMutation.isPending ||
                          removeReactionMutation.isPending
                        }
                      >
                        {reactionIcons[type]}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {reactionLabels[type]} ({counts[type]})
                      </p>
                    </TooltipContent>
                  </Tooltip>
                )
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </TooltipProvider>
    );
  }

  // Default variant - full button with text
  return (
    <TooltipProvider>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex items-center space-x-2",
              userReaction && reactionColors[userReaction.reactionType],
              className
            )}
          >
            {userReaction
              ? reactionIcons[userReaction.reactionType]
              : reactionIcons.like}
            <span>
              {userReaction
                ? reactionLabels[userReaction.reactionType]
                : "Thích"}
              {counts.total > 0 && ` (${counts.total})`}
            </span>
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
                    disabled={
                      addReactionMutation.isPending ||
                      removeReactionMutation.isPending
                    }
                  >
                    {reactionIcons[type]}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {reactionLabels[type]} ({counts[type]})
                  </p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
};
