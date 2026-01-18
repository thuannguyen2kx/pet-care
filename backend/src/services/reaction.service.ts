import { CommentModel } from "../models/comment.model";
import { PostModel } from "../models/post.model";
import { ReactionModel } from "../models/reaction.model";
import { NotFoundException } from "../utils/app-error";
import { Types } from "mongoose";

type ReactionType = "like" | "love" | "laugh" | "sad" | "angry";
type ContentType = "post" | "comment";

interface ReactionCounts {
  like: number;
  love: number;
  laugh: number;
  sad: number;
  angry: number;
  total: number;
}

/**
 * Add/Update reaction to a post or comment
 */
export const addReactionService = async ({
  contentType,
  contentId,
  userId,
  reactionType,
}: {
  contentType: ContentType;
  contentId: string;
  userId: Types.ObjectId;
  reactionType: ReactionType;
}) => {
  // Check if the content exists
  await checkContentExists(contentType, contentId);

  // Check if user already reacted to this content
  const existingReaction = await ReactionModel.findOne({
    contentType,
    contentId,
    userId,
  });

  let reaction;
  let previousReactionType: ReactionType | null = null;

  if (existingReaction) {
    // Store previous reaction type for stats update
    previousReactionType = existingReaction.reactionType as ReactionType;

    // Only update if reaction type changed
    if (previousReactionType !== reactionType) {
      // Update existing reaction
      existingReaction.reactionType = reactionType;
      reaction = await existingReaction.save();
    } else {
      // Same reaction type, no need to update
      reaction = existingReaction;
    }
  } else {
    // Create new reaction
    reaction = await ReactionModel.create({
      contentType,
      contentId,
      userId,
      reactionType,
    });

    // Update content stats - increment total count
    await updateContentStats(contentType, contentId, 1);
  }

  // Return reaction with user info
  const populatedReaction = await ReactionModel.findById(reaction._id).populate(
    "userId",
    "fullName profilePicture",
  );

  return { reaction: populatedReaction };
};

/**
 * Remove reaction from a post or comment
 */
export const removeReactionService = async ({
  contentType,
  contentId,
  userId,
}: {
  contentType: ContentType;
  contentId: string;
  userId: Types.ObjectId;
}) => {
  // Check if the content exists
  await checkContentExists(contentType, contentId);

  // Find and delete the reaction
  const reaction = await ReactionModel.findOneAndDelete({
    contentType,
    contentId,
    userId,
  });

  if (!reaction) {
    throw new NotFoundException("Reaction not found");
  }

  // Update content stats - decrement count
  await updateContentStats(contentType, contentId, -1);

  return { success: true };
};

/**
 * Get reactions for a post or comment
 */
export const getReactionsService = async ({
  contentType,
  contentId,
}: {
  contentType: ContentType;
  contentId: string;
}) => {
  // Check if the content exists
  await checkContentExists(contentType, contentId);

  // Get all reactions for this content
  const reactions = await ReactionModel.find({
    contentType,
    contentId,
  }).populate("userId", "fullName profilePicture");

  // Count by type
  const counts: ReactionCounts = {
    like: 0,
    love: 0,
    laugh: 0,
    sad: 0,
    angry: 0,
    total: reactions.length,
  };

  reactions.forEach((reaction) => {
    counts[reaction.reactionType as ReactionType] += 1;
  });

  // Get top reactors (for display in UI)
  const topReactors = reactions.slice(0, 10).map((reaction) => ({
    userId: reaction.userId,
    reactionType: reaction.reactionType,
  }));

  return {
    counts,
    topReactors,
  };
};

/**
 * Get users who reacted to a post or comment
 */
export const getReactorsService = async ({
  contentType,
  contentId,
  reactionType,
  page = 1,
  limit = 20,
}: {
  contentType: ContentType;
  contentId: string;
  reactionType?: ReactionType;
  page?: number;
  limit?: number;
}) => {
  // Check if the content exists
  await checkContentExists(contentType, contentId);

  // Build query
  const query: any = {
    contentType,
    contentId,
  };

  // Add reaction type filter if provided
  if (reactionType) {
    query.reactionType = reactionType;
  }

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Get total count
  const total = await ReactionModel.countDocuments(query);

  // Get paginated reactors
  const reactors = await ReactionModel.find(query)
    .populate("userId", "fullName profilePicture")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
    reactors,
    pagination: {
      total,
      page,
      limit,
      hasMore: skip + reactors.length < total,
    },
  };
};

/**
 * Get user reaction for a post or comment
 */
export const getUserReactionService = async ({
  contentType,
  contentId,
  userId,
}: {
  contentType: ContentType;
  contentId: string;
  userId: Types.ObjectId;
}) => {
  // Check if the content exists
  await checkContentExists(contentType, contentId);

  // Get user's reaction
  const reaction = await ReactionModel.findOne({
    contentType,
    contentId,
    userId,
  });

  return {
    reaction: reaction || null,
  };
};

/**
 * Helper method to check if content exists
 */
const checkContentExists = async (
  contentType: ContentType,
  contentId: string,
): Promise<void> => {
  let content;

  if (contentType === "post") {
    content = await PostModel.findById(contentId);
    if (!content) {
      throw new NotFoundException("Post not found");
    }
  } else {
    content = await CommentModel.findById(contentId);
    if (!content) {
      throw new NotFoundException("Comment not found");
    }
  }
};

/**
 * Helper method to update content stats
 */
const updateContentStats = async (
  contentType: ContentType,
  contentId: string,
  change: number,
): Promise<void> => {
  if (contentType === "post") {
    // Update post's likeCount
    await PostModel.findByIdAndUpdate(contentId, {
      $inc: { "stats.likeCount": change },
    });
  } else if (contentType === "comment") {
    // For comments, initialize stats object if it doesn't exist
    // and then update likeCount
    const comment = await CommentModel.findById(contentId);

    if (comment) {
      if (!comment.stats) {
        // If stats doesn't exist, create it with initial values
        await CommentModel.findByIdAndUpdate(contentId, {
          $set: {
            stats: {
              likeCount: Math.max(0, change), // Ensure it's not negative
              replyCount: 0,
            },
          },
        });
      } else {
        // If stats exists, just increment likeCount
        await CommentModel.findByIdAndUpdate(contentId, {
          $inc: { "stats.likeCount": change },
        });
      }
    }
  }
};
