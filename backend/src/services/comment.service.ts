import CommentModel, { IComment } from "../models/comment.model";
import PostModel from "../models/post.model";
import { BadRequestException, ForbiddenException, NotFoundException } from "../utils/app-error";

interface PaginationResult {
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
}

/**
 * Add a comment to a post
 */
export const addCommentService = async ({
  postId,
  userId,
  content,
  parentCommentId
}: {
  postId: string;
  userId: string;
  content: string;
  parentCommentId?: string;
}) => {
  // Check if post exists
  const post = await PostModel.findById(postId);
  
  if (!post) {
    throw new NotFoundException("Post not found");
  }
  
  // Check if post is public or if user is the author
  if (post.visibility !== "public" && post.authorId.toString() !== userId.toString()) {
    throw new ForbiddenException("Cannot comment on this post");
  }
  
  // If it's a reply, check if parent comment exists
  if (parentCommentId) {
    const parentComment = await CommentModel.findOne({
      _id: parentCommentId,
      postId,
      status: "active"
    });
    
    if (!parentComment) {
      throw new NotFoundException("Parent comment not found");
    }
    
    // Ensure we're not replying to a reply (max 2 levels)
    if (parentComment.parentCommentId) {
      throw new BadRequestException("Cannot reply to a reply");
    }
  }
  
  // Create comment
  const comment = await CommentModel.create({
    postId,
    authorId: userId,
    content,
    parentCommentId: parentCommentId || undefined,
    status: "active"
  });
  
  // Update post comment count
  post.stats.commentCount += 1;
  await post.save();
  
  // Return populated comment
  const populatedComment = await CommentModel.findById(comment._id)
    .populate("authorId", "fullName profilePicture");
  
  return { comment: populatedComment };
};

/**
 * Get comments for a post with pagination
 */
export const getPostCommentsService = async ({
  postId,
  userId,
  page,
  limit,
  parentId
}: {
  postId: string;
  userId?: string;
  page: number;
  limit: number;
  parentId?: string;
}) => {
  // Check if post exists
  const post = await PostModel.findById(postId);
  
  if (!post) {
    throw new NotFoundException("Post not found");
  }
  
  // Check if the post is public or if the user is the author
  if (
    post.visibility !== "public" && 
    (!userId || post.authorId.toString() !== userId.toString())
  ) {
    throw new ForbiddenException("Not authorized to view comments on this post");
  }
  
  // Base query
  const baseQuery = {
    postId,
    status: "active"
  };
  
  // If parentId is provided, get replies to that comment
  // Otherwise get top-level comments
  const query = {
    ...baseQuery,
    ...(parentId 
      ? { parentCommentId: parentId } 
      : { parentCommentId: { $exists: false } })
  };
  
  // Count total matching comments
  const totalItems = await CommentModel.countDocuments(query);
  const totalPages = Math.ceil(totalItems / limit);
  
  // Get comments with pagination
  const comments = await CommentModel.find(query)
    .populate("authorId", "fullName profilePicture")
    .sort({ createdAt: parentId ? 1 : -1 }) // Sort replies chronologically, but parent comments by newest first
    .skip((page - 1) * limit)
    .limit(limit);
  
  // If these are top-level comments, get the first few replies for each
  if (!parentId) {
    // Get all comment IDs
    const commentIds = comments.map(comment => comment._id);
    
    // Get first 3 replies for each parent comment
    const initialReplies = await CommentModel.find({
      postId,
      status: "active",
      parentCommentId: { $in: commentIds }
    })
      .populate("authorId", "fullName profilePicture")
      .sort({ createdAt: 1 });
    
    // Group replies by parent ID
    const repliesByParent: Record<string, IComment[]> = {};
    initialReplies.forEach(reply => {
      const parentId = reply.parentCommentId?.toString() || "";
      if (!repliesByParent[parentId]) {
        repliesByParent[parentId] = [];
      }
      // Only add first 3 replies
      if (repliesByParent[parentId].length < 3) {
        repliesByParent[parentId].push(reply);
      }
    });
    
    // Add replies to each comment
const commentsWithReplies = comments.map(comment => {
  const commentObj = comment.toObject() as IComment;
  
  // Tạo một đối tượng mới với đầy đủ thuộc tính
  const commentWithReplies = {
    ...commentObj,
    replies: repliesByParent[comment._id as string] || [],
    replyCount: initialReplies.filter(
      reply => reply.parentCommentId === comment._id
    ).length,
  };

  return commentWithReplies;
});
    
    const pagination: PaginationResult = {
      page,
      limit,
      totalPages,
      totalItems,
      hasNextPage: page < totalPages
    };
    
    return { 
      comments: commentsWithReplies,
      pagination
    };
  }
  
  // For replies, just return the paginated comments
  const pagination: PaginationResult = {
    page,
    limit,
    totalPages,
    totalItems,
    hasNextPage: page < totalPages
  };
  
  return {
    comments,
    pagination
  };
};

/**
 * Update a comment
 */
export const updateCommentService = async ({
  commentId,
  userId,
  content
}: {
  commentId: string;
  userId: string;
  content: string;
}) => {
  // Find comment
  const comment = await CommentModel.findById(commentId);
  
  if (!comment) {
    throw new NotFoundException("Comment not found");
  }
  
  // Check if user is the author of the comment
  if (comment.authorId.toString() !== userId.toString()) {
    throw new ForbiddenException("Not authorized to update this comment");
  }
  
  // Update comment
  comment.content = content;
  await comment.save();
  
  // Return updated comment
  const updatedComment = await CommentModel.findById(comment._id)
    .populate("authorId", "fullName profilePicture");
  
  return { comment: updatedComment };
};

/**
 * Delete a comment
 */
export const deleteCommentService = async ({
  commentId,
  userId,
  userRole
}: {
  commentId: string;
  userId: string;
  userRole?: string;
}) => {
  // Find comment
  const comment = await CommentModel.findById(commentId);
  
  if (!comment) {
    throw new NotFoundException("Comment not found");
  }
  
  // Check if user is the author of the comment or an admin
  if (comment.authorId.toString() !== userId.toString() && userRole !== "admin") {
    throw new ForbiddenException("Not authorized to delete this comment");
  }
  
  // Update post comment count if this is a parent comment
  if (!comment.parentCommentId) {
    const post = await PostModel.findById(comment.postId);
    if (post && post.stats.commentCount > 0) {
      post.stats.commentCount -= 1;
      await post.save();
    }
  }
  
  // Delete the comment
  await comment.deleteOne();
  
  // Delete all replies if this is a parent comment
  if (!comment.parentCommentId) {
    await CommentModel.deleteMany({ parentCommentId: comment._id });
  }
  
  return { success: true };
};