import express from "express";
import {
  addCommentController,
  deleteCommentController,
  getPostCommentsController,
  updateCommentController,
} from "../controllers/comment.controller";
import {
  addReactionController,
  getReactionsController,
  getReactorsController,
  getUserReactionController,
  removeReactionController,
} from "../controllers/reaction.controller";
import { commentContext } from "../middlewares/comment-context";

const commentRoutes = express.Router();

// -------- Comment resource --------
commentRoutes.put("/:commentId", updateCommentController);

commentRoutes.delete("/:commentId", deleteCommentController);

// -------- Replies --------
commentRoutes.post("/:commentId/replies", addCommentController);

commentRoutes.get("/:commentId/replies", getPostCommentsController);

// -------- Comment reactions --------
commentRoutes.get(
  "/:commentId/reactions",
  commentContext,
  getReactionsController,
);

commentRoutes.post(
  "/:commentId/reactions",
  commentContext,
  addReactionController,
);

commentRoutes.delete(
  "/:commentId/reactions",
  commentContext,
  removeReactionController,
);

commentRoutes.get(
  "/:commentId/reactions/me",
  commentContext,
  getUserReactionController,
);

commentRoutes.get(
  "/:commentId/reactions/users",
  commentContext,
  getReactorsController,
);

export default commentRoutes;
