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
  addPostCommentController,
  getPostCommentsController,
} from "../controllers/comment.controller";
import {
  addReactionController,
  getReactionsController,
  getReactorsController,
  getUserReactionController,
  removeReactionController,
} from "../controllers/reaction.controller";
import { postContext } from "../middlewares/post-context";

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
postRoutes.post("/:postId/comments", addPostCommentController);

postRoutes.get("/:postId/comments", getPostCommentsController);

// -------- Post reactions --------
postRoutes.get("/:postId/reactions", postContext, getReactionsController);

postRoutes.post("/:postId/reactions", postContext, addReactionController);

postRoutes.delete("/:postId/reactions", postContext, removeReactionController);

postRoutes.get("/:postId/reactions/me", postContext, getUserReactionController);

postRoutes.get("/:postId/reactions/users", postContext, getReactorsController);

export default postRoutes;
