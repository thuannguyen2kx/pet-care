import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import {
  addReactionService,
  removeReactionService,
  getReactionsService,
  getUserReactionService,
  getReactorsService,
} from "../services/reaction.service";
import {
  contentIdSchema,
  contentTypeSchema,
  reactionTypeSchema,
  paginationSchema,
} from "../validation/reaction.validation";

/**
 * @desc    Add/Update reaction to a post or comment
 * @route   POST /api/reactions/:contentType/:id
 * @access  Private
 */
export const addReactionController = asyncHandler(
  async (req: Request, res: Response) => {
    const contentType = req.contentType!;
    const userId = req.user!._id;
    const reactionType = reactionTypeSchema.parse(req.body.reactionType);
    const contentId =
      contentType === "Post"
        ? contentIdSchema.parse(req.params.postId)
        : contentIdSchema.parse(req.params.commentId);

    const { reaction } = await addReactionService({
      contentType,
      contentId,
      userId,
      reactionType,
    });

    return res.status(HTTPSTATUS.OK).json({
      message: "Reaction added successfully",
      reaction,
    });
  },
);

/**
 * @desc    Remove reaction from a post or comment
 * @route   DELETE /api/reactions/:contentType/:id
 * @access  Private
 */
export const removeReactionController = asyncHandler(
  async (req: Request, res: Response) => {
    const contentType = req.contentType!;
    const userId = req.user!._id;
    const contentId =
      contentType === "Post"
        ? contentIdSchema.parse(req.params.postId)
        : contentIdSchema.parse(req.params.commentId);

    await removeReactionService({
      contentType,
      contentId,
      userId,
    });

    return res.status(HTTPSTATUS.OK).json({
      message: "Reaction removed successfully",
    });
  },
);

/**
 * @desc    Get reactions for a post or comment
 * @route   GET /api/reactions/:contentType/:id
 * @access  Public
 */
export const getReactionsController = asyncHandler(
  async (req: Request, res: Response) => {
    const contentType = req.contentType!;
    const contentId =
      contentType === "Post"
        ? contentIdSchema.parse(req.params.postId)
        : contentIdSchema.parse(req.params.commentId);

    const { counts, topReactors } = await getReactionsService({
      contentType,
      contentId,
    });

    return res.status(HTTPSTATUS.OK).json({
      message: "Reactions fetched successfully",
      counts,
      topReactors,
    });
  },
);

/**
 * @desc    Get users who reacted to a post or comment
 * @route   GET /api/reactions/:contentType/:id/users
 * @access  Public
 */
export const getReactorsController = asyncHandler(
  async (req: Request, res: Response) => {
    const contentType = req.contentType!;
    const contentId =
      contentType === "Post"
        ? contentIdSchema.parse(req.params.postId)
        : contentIdSchema.parse(req.params.commentId);

    const reactionType = req.query.reactionType as string | undefined;

    const { page = 1, limit = 20 } = paginationSchema.parse({
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
    });

    const { reactors, pagination } = await getReactorsService({
      contentType,
      contentId,
      reactionType: reactionType as any,
      page,
      limit,
    });

    return res.status(HTTPSTATUS.OK).json({
      message: "Reactors fetched successfully",
      reactors,
      pagination,
    });
  },
);

/**
 * @desc    Get user reaction for a post or comment
 * @route   GET /api/reactions/user/:contentType/:id
 * @access  Private
 */
export const getUserReactionController = asyncHandler(
  async (req: Request, res: Response) => {
    const contentType = req.contentType!;
    const contentId =
      contentType === "Post"
        ? contentIdSchema.parse(req.params.postId)
        : contentIdSchema.parse(req.params.commentId);
    const userId = req.user!._id;

    const { reaction } = await getUserReactionService({
      contentType,
      contentId,
      userId,
    });

    return res.status(HTTPSTATUS.OK).json({
      message: "User reaction fetched successfully",
      reaction,
    });
  },
);
