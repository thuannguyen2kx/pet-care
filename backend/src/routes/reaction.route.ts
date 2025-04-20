import { Router } from "express";
import {
  addReactionController,
  removeReactionController,
  getReactionsController,
  getUserReactionController,
  getReactorsController
} from "../controllers/reaction.controller";

const reactionRoutes = Router();

// Public routes
reactionRoutes.get("/:contentType/:id", getReactionsController);
reactionRoutes.get("/:contentType/:id/users", getReactorsController);

// Protected routes - require authentication
reactionRoutes.post("/:contentType/:id", addReactionController);
reactionRoutes.delete("/:contentType/:id", removeReactionController);
reactionRoutes.get("/user/:contentType/:id", getUserReactionController);

export default reactionRoutes;