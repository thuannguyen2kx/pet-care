import Reaction from "../models/reaction.model";
import PostModel from "../models/post.model";
import CommentModel from "../models/comment.model";
import { NotFoundException } from "../utils/app-error";

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
  reactionType
}: {
  contentType: ContentType;
  contentId: string;
  userId: string;
  reactionType: ReactionType;
}) => {
  // Check if the content exists
  await checkContentExists(contentType, contentId);
  
  // Check if user already reacted to this content
  const existingReaction = await Reaction.findOne({
    contentType,
    contentId,
    userId
  });
  
  let reaction;
  
  if (existingReaction) {
    // Update existing reaction
    existingReaction.reactionType = reactionType;
    reaction = await existingReaction.save();
  } else {
    // Create new reaction
    reaction = await Reaction.create({
      contentType,
      contentId,
      userId,
      reactionType
    });
    
    // Update content stats
    await updateContentStats(contentType, contentId, 1);
  }
  
  // Return reaction with user info
  const populatedReaction = await Reaction.findById(reaction._id)
    .populate("userId", "fullName profilePicture");
  
  return { reaction: populatedReaction };
};

/**
 * Remove reaction from a post or comment
 */
export const removeReactionService = async ({
  contentType,
  contentId,
  userId
}: {
  contentType: ContentType;
  contentId: string;
  userId: string;
}) => {
  // Check if the content exists
  await checkContentExists(contentType, contentId);
  
  // Find and delete the reaction
  const reaction = await Reaction.findOneAndDelete({
    contentType,
    contentId,
    userId
  });
  
  if (!reaction) {
    throw new NotFoundException("Reaction not found");
  }
  
  // Update content stats
  await updateContentStats(contentType, contentId, -1);
  
  return { success: true };
};

/**
 * Get reactions for a post or comment
 */
export const getReactionsService = async ({
  contentType,
  contentId
}: {
  contentType: ContentType;
  contentId: string;
}) => {
  // Check if the content exists
  await checkContentExists(contentType, contentId);
  
  // Get all reactions for this content
  const reactions = await Reaction.find({
    contentType,
    contentId
  }).populate("userId", "fullName profilePicture");
  
  // Count by type
  const counts: ReactionCounts = {
    like: 0,
    love: 0,
    laugh: 0,
    sad: 0,
    angry: 0,
    total: reactions.length
  };
  
  reactions.forEach(reaction => {
    counts[reaction.reactionType] += 1;
  });
  
  return {
    reactions,
    counts
  };
};

/**
 * Get user reaction for a post or comment
 */
export const getUserReactionService = async ({
  contentType,
  contentId,
  userId
}: {
  contentType: ContentType;
  contentId: string;
  userId: string;
}) => {
  // Check if the content exists
  await checkContentExists(contentType, contentId);
  
  // Get user's reaction
  const reaction = await Reaction.findOne({
    contentType,
    contentId,
    userId
  });
  
  return {
    reaction: reaction || null
  };
};

/**
 * Helper method to check if content exists
 */
const checkContentExists = async (
  contentType: ContentType,
  contentId: string
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
  change: number
): Promise<void> => {
  if (contentType === "post") {
    await PostModel.findByIdAndUpdate(contentId, {
      $inc: { "stats.reactionCount": change }
    });
  }
  // For comments, we could add a reactionCount field if needed
};