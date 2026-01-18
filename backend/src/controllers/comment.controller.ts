import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import {
  addCommentService,
  getPostCommentsService,
  updateCommentService,
  deleteCommentService,
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
export const addCommentController = asyncHandler(
  async (req: Request, res: Response) => {
    const postId = postIdSchema.parse(req.params.id);
    const userId = req.user!._id;
    const content = commentContentSchema.parse(req.body.content);
    const parentCommentId = req.body.parentCommentId
      ? parentCommentIdSchema.parse(req.body.parentCommentId)
      : undefined;

    const { comment } = await addCommentService({
      postId,
      userId,
      content,
      parentCommentId,
    });

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Comment added successfully",
      comment,
    });
  },
);

/**
 * @desc    Get comments for a post with pagination
 * @route   GET /api/posts/:id/comments
 * @access  Public
 */
export const getPostCommentsController = asyncHandler(
  async (req: Request, res: Response) => {
    const postId = postIdSchema.parse(req.params.id);
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
