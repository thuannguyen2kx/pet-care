import { Types } from "mongoose";
import { PostModel } from "../models/post.model";
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from "../utils/app-error";
import { CommentDocument, CommentModel } from "../models/comment.model";

interface PaginationResult {
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
}
const addCommentInternal = async ({
  postId,
  userId,
  content,
  parentCommentId,
}: {
  postId: string;
  userId: Types.ObjectId;
  content: string;
  parentCommentId?: string;
}) => {
  const post = await PostModel.findById(postId);

  if (!post) {
    throw new NotFoundException("Post not found");
  }

  if (
    post.visibility !== "public" &&
    post.authorId.toString() !== userId.toString()
  ) {
    throw new ForbiddenException("Cannot comment on this post");
  }

  const comment = await CommentModel.create({
    postId,
    authorId: userId,
    content,
    parentCommentId,
    status: "active",
  });

  await PostModel.updateOne(
    { _id: postId },
    { $inc: { "stats.commentCount": 1 } },
  );

  return {
    comment: await CommentModel.findById(comment._id).populate(
      "authorId",
      "fullName profilePicture",
    ),
  };
};

/**
 * Add a comment to a post
 */
export const addPostCommentService = async ({
  postId,
  userId,
  content,
}: {
  postId: string;
  userId: Types.ObjectId;
  content: string;
}) => {
  return addCommentInternal({
    postId,
    userId,
    content,
  });
};

export const addReplyService = async ({
  parentCommentId,
  userId,
  content,
}: {
  parentCommentId: string;
  userId: Types.ObjectId;
  content: string;
}) => {
  const parentComment = await CommentModel.findById(parentCommentId);

  if (!parentComment || parentComment.status !== "active") {
    throw new NotFoundException("Parent comment not found");
  }

  if (parentComment.parentCommentId) {
    throw new BadRequestException("Cannot reply to a reply");
  }

  return addCommentInternal({
    postId: parentComment.postId.toString(),
    parentCommentId,
    userId,
    content,
  });
};

/**
 * Get comments for a post with pagination
 */
export const getPostCommentsService = async ({
  postId,
  userId,
  page,
  limit,
  parentId,
}: {
  postId: string;
  userId?: Types.ObjectId;
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
    throw new ForbiddenException(
      "Not authorized to view comments on this post",
    );
  }

  // Base query
  const baseQuery = {
    postId,
    status: "active",
  };

  // If parentId is provided, get replies to that comment
  // Otherwise get top-level comments
  const query = {
    ...baseQuery,
    ...(parentId
      ? { parentCommentId: parentId }
      : { parentCommentId: { $exists: false } }),
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
    const commentIds = comments.map((comment) => comment._id);

    // Get first 3 replies for each parent comment
    const initialReplies = await CommentModel.find({
      postId,
      status: "active",
      parentCommentId: { $in: commentIds },
    })
      .populate("authorId", "fullName profilePicture")
      .sort({ createdAt: 1 });

    // Group replies by parent ID
    const repliesByParent: Record<string, CommentDocument[]> = {};
    initialReplies.forEach((reply) => {
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
    const commentsWithReplies = comments.map((comment) => {
      const commentObj = comment.toObject();

      // Tạo một đối tượng mới với đầy đủ thuộc tính
      const commentWithReplies = {
        ...commentObj,
        replies: repliesByParent[comment._id.toString()] || [],
        replyCount: initialReplies.filter(
          (reply) => reply.parentCommentId === comment._id,
        ).length,
      };

      return commentWithReplies;
    });

    const pagination: PaginationResult = {
      page,
      limit,
      totalPages,
      totalItems,
      hasNextPage: page < totalPages,
    };

    return {
      comments: commentsWithReplies,
      pagination,
    };
  }

  // For replies, just return the paginated comments
  const pagination: PaginationResult = {
    page,
    limit,
    totalPages,
    totalItems,
    hasNextPage: page < totalPages,
  };

  return {
    comments,
    pagination,
  };
};

/**
 * Update a comment
 */
export const updateCommentService = async ({
  commentId,
  userId,
  content,
}: {
  commentId: string;
  userId: Types.ObjectId;
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
  const updatedComment = await CommentModel.findById(comment._id).populate(
    "authorId",
    "fullName profilePicture",
  );

  return { comment: updatedComment };
};

/**
 * Delete a comment
 */
export const deleteCommentService = async ({
  commentId,
  userId,
  userRole,
}: {
  commentId: string;
  userId: Types.ObjectId;
  userRole?: string;
}) => {
  // Find comment
  const comment = await CommentModel.findById(commentId);

  if (!comment) {
    throw new NotFoundException("Comment not found");
  }

  // Check if user is the author of the comment or an admin
  if (
    comment.authorId.toString() !== userId.toString() &&
    userRole !== "admin"
  ) {
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
