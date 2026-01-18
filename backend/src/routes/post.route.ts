import express from "express";
import {
  getPostsController,
  getPostByIdController,
  createPostController,
  updatePostController,
  deletePostController,
  getPostsForModerationController,
  updatePostStatusController,
  reportPostController,
  getReportedPostsController,
  resolveReportController,
  getFeaturedPostsController,
  setPostFeatureController,
  getUserPostsController,
} from "../controllers/post.controller";
import { authorizeRoles } from "../middlewares/auth.middleware";
import { Roles } from "../enums/role.enum";
import {
  addCommentController,
  getPostCommentsController,
} from "../controllers/comment.controller";
import {
  addReactionController,
  getReactionsController,
  getReactorsController,
  getUserReactionController,
  removeReactionController,
} from "../controllers/reaction.controller";

const postRoutes = express.Router();

// -------- Public --------
postRoutes.get("/", getPostsController);
postRoutes.get("/featured", getFeaturedPostsController);
postRoutes.get("/:postId", getPostByIdController);

// -------- Authenticated --------
postRoutes.post("/", createPostController);
postRoutes.put("/:postId", updatePostController);
postRoutes.delete("/:postId", deletePostController);
postRoutes.post("/:postId/reports", reportPostController);

// -------- User context --------
postRoutes.get("/user/:userId/posts", getUserPostsController);

// -------- Admin / Moderator --------
postRoutes.get(
  "/admin/posts/moderation",
  authorizeRoles([Roles.ADMIN, Roles.EMPLOYEE]),
  getPostsForModerationController,
);

postRoutes.get(
  "/admin/posts/reports",
  authorizeRoles([Roles.ADMIN, Roles.EMPLOYEE]),
  getReportedPostsController,
);

postRoutes.put(
  "/admin/posts/:postId/status",
  authorizeRoles([Roles.ADMIN, Roles.EMPLOYEE]),
  updatePostStatusController,
);

postRoutes.put(
  "/admin/posts/:postId/featured",
  authorizeRoles([Roles.ADMIN, Roles.EMPLOYEE]),
  setPostFeatureController,
);

postRoutes.put(
  "/admin/posts/:postId/reports/:reportId",
  authorizeRoles([Roles.ADMIN, Roles.EMPLOYEE]),
  resolveReportController,
);

// -------- Comments by post --------
postRoutes.post("/posts/:postId/comments", addCommentController);

postRoutes.get("/posts/:postId/comments", getPostCommentsController);

// -------- Post reactions --------
postRoutes.get("/posts/:postId/reactions", getReactionsController);

postRoutes.post("/posts/:postId/reactions", addReactionController);

postRoutes.delete("/posts/:postId/reactions", removeReactionController);

postRoutes.get("/posts/:postId/reactions/me", getUserReactionController);

postRoutes.get("/posts/:postId/reactions/users", getReactorsController);

export default postRoutes;
