
import express from 'express';
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
  getUserPostsController
} from '../controllers/post.controller';
import { authorizeRoles } from '../middlewares/auth.middleware';
import { Roles } from '../enums/role.enum';

const postRoutes = express.Router();

// Public routes
postRoutes.get('/', getPostsController);
postRoutes.get('/featured', getFeaturedPostsController);
postRoutes.get('/:id', getPostByIdController);

// Protected routes (require authentication)
postRoutes.post('/', createPostController);
postRoutes.put('/:id', updatePostController);
postRoutes.delete('/:id', deletePostController);
postRoutes.post('/:id/report', reportPostController);
postRoutes.get('/user/my-posts', getUserPostsController);

// Admin routes
postRoutes.get('/admin/moderation', authorizeRoles([Roles.ADMIN]), getPostsForModerationController);
postRoutes.get('/admin/reported', authorizeRoles([Roles.ADMIN]), getReportedPostsController);
postRoutes.put('/:id/status', authorizeRoles([Roles.ADMIN]), updatePostStatusController);
postRoutes.put('/:id/featured', authorizeRoles([Roles.ADMIN]), setPostFeatureController);
postRoutes.put('/:id/reports/:reportId', authorizeRoles([Roles.ADMIN]), resolveReportController);

export default postRoutes;