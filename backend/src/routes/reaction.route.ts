import { Router } from "express";
import {
  addReactionController,
  removeReactionController,
  getReactionsController,
  getUserReactionController
} from "../controllers/reaction.controller";

const reactionRoutes = Router();

// Reaction routes
reactionRoutes.post(
  "/:contentType/:id/react", 
  addReactionController
);

reactionRoutes.delete(
  "/:contentType/:id/react", 
  removeReactionController
);

reactionRoutes.get(
  "/:contentType/:id/reactions", 
  getReactionsController
);

reactionRoutes.get(
  "/:contentType/:id/reactions/me", 
  getUserReactionController
);
export default reactionRoutes