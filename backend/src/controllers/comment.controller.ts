import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import {
  getPostCommentsService,
  updateCommentService,
  deleteCommentService,
  addReplyService,
  addPostCommentService,
} from "../services/comment.service";
import {
  commentContentSchema,
  commentIdSchema,
  parentCommentIdSchema,
  postIdSchema,
} from "../validation/comment.validation";

/**
 * @desc    Add comment to a post
 * @route   POST /api/posts/:id/comments
 * @access  Private
 */
export const addPostCommentController = asyncHandler(async (req, res) => {
  const postId = postIdSchema.parse(req.params.postId);
  const userId = req.user!._id;
  const content = commentContentSchema.parse(req.body.content);

  const { comment } = await addPostCommentService({
    postId,
    userId,
    content,
  });

  res.status(201).json({
    message: "Comment added successfully",
    comment,
  });
});

export const addReplyController = asyncHandler(async (req, res) => {
  const commentId = parentCommentIdSchema.parse(req.params.commentId);
  const userId = req.user!._id;
  const content = commentContentSchema.parse(req.body.content);

  const { comment } = await addReplyService({
    parentCommentId: commentId,
    userId,
    content,
  });

  res.status(201).json({
    message: "Reply added successfully",
    comment,
  });
});

/**
 * @desc    Get comments for a post with pagination
 * @route   GET /api/posts/:id/comments
 * @access  Public
 */
export const getPostCommentsController = asyncHandler(
  async (req: Request, res: Response) => {
    const postId = postIdSchema.parse(req.params.postId);
    const userId = req.user?._id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const parentId = req.query.parentId as string | undefined;

    const { comments, pagination } = await getPostCommentsService({
      postId,
      userId,
      page,
      limit,
      parentId,
    });

    return res.status(HTTPSTATUS.OK).json({
      message: "Comments fetched successfully",
      comments,
      pagination,
    });
  },
);

/**
 * @desc    Update a comment
 * @route   PUT /api/posts/comments/:id
 * @access  Private
 */
export const updateCommentController = asyncHandler(
  async (req: Request, res: Response) => {
    const commentId = commentIdSchema.parse(req.params.id);
    const userId = req.user!._id;
    const content = commentContentSchema.parse(req.body.content);

    const { comment } = await updateCommentService({
      commentId,
      userId,
      content,
    });

    return res.status(HTTPSTATUS.OK).json({
      message: "Comment updated successfully",
      comment,
    });
  },
);

/**
 * @desc    Delete a comment
 * @route   DELETE /api/posts/comments/:id
 * @access  Private
 */
export const deleteCommentController = asyncHandler(
  async (req: Request, res: Response) => {
    const commentId = commentIdSchema.parse(req.params.id);
    const userId = req.user!._id;
    const userRole = req.user?.role;

    await deleteCommentService({
      commentId,
      userId,
      userRole,
    });

    return res.status(HTTPSTATUS.OK).json({
      message: "Comment deleted successfully",
    });
  },
);
