import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import {
  addReactionService,
  removeReactionService,
  getReactionsService,
  getUserReactionService
} from "../services/reaction.service";
import { contentIdSchema, contentTypeSchema, reactionTypeSchema } from "../validation/reaction.validation";

/**
 * @desc    Add/Update reaction to a post or comment
 * @route   POST /api/:contentType/:id/react
 * @access  Private
 */
export const addReactionController = asyncHandler(
  async (req: Request, res: Response) => {
    const contentId = contentIdSchema.parse(req.params.id);
    const contentType = contentTypeSchema.parse(req.params.contentType === "posts" ? "post" : "comment");
    const userId = req.user?._id;
    const reactionType = reactionTypeSchema.parse(req.body.reactionType);

    const { reaction } = await addReactionService({
      contentType,
      contentId,
      userId,
      reactionType
    });

    return res.status(HTTPSTATUS.OK).json({
      message: "Reaction added successfully",
      reaction
    });
  }
);

/**
 * @desc    Remove reaction from a post or comment
 * @route   DELETE /api/:contentType/:id/react
 * @access  Private
 */
export const removeReactionController = asyncHandler(
  async (req: Request, res: Response) => {
    const contentId = contentIdSchema.parse(req.params.id);
    const contentType = contentTypeSchema.parse(req.params.contentType === "posts" ? "post" : "comment");
    const userId = req.user?._id;

    await removeReactionService({
      contentType,
      contentId,
      userId
    });

    return res.status(HTTPSTATUS.OK).json({
      message: "Reaction removed successfully"
    });
  }
);

/**
 * @desc    Get reactions for a post or comment
 * @route   GET /api/:contentType/:id/reactions
 * @access  Public
 */
export const getReactionsController = asyncHandler(
  async (req: Request, res: Response) => {
    const contentId = contentIdSchema.parse(req.params.id);
    const contentType = contentTypeSchema.parse(req.params.contentType === "posts" ? "post" : "comment");

    const { reactions, counts } = await getReactionsService({
      contentType,
      contentId
    });

    return res.status(HTTPSTATUS.OK).json({
      message: "Reactions fetched successfully",
      reactions,
      counts
    });
  }
);

/**
 * @desc    Get user reaction for a post or comment
 * @route   GET /api/:contentType/:id/reactions/me
 * @access  Private
 */
export const getUserReactionController = asyncHandler(
  async (req: Request, res: Response) => {
    const contentId = contentIdSchema.parse(req.params.id);
    const contentType = contentTypeSchema.parse(req.params.contentType === "posts" ? "post" : "comment");
    const userId = req.user?._id;

    const { reaction } = await getUserReactionService({
      contentType,
      contentId,
      userId
    });

    return res.status(HTTPSTATUS.OK).json({
      message: "User reaction fetched successfully",
      reaction
    });
  }
);