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

const commentRoutes = express.Router();

// -------- Comment resource --------
commentRoutes.put("/:commentId", updateCommentController);

commentRoutes.delete("/:commentId", deleteCommentController);

// -------- Replies --------
commentRoutes.post("/:commentId/replies", addCommentController);

commentRoutes.get("/:commentId/replies", getPostCommentsController);

// -------- Comment reactions --------
commentRoutes.get("/:commentId/reactions", getReactionsController);

commentRoutes.post("/:commentId/reactions", addReactionController);

commentRoutes.delete("/:commentId/reactions", removeReactionController);

commentRoutes.get("/:commentId/reactions/me", getUserReactionController);

commentRoutes.get("/:commentId/reactions/users", getReactorsController);

export default commentRoutes;
