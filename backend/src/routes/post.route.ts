
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
postRoutes.get('/user/:userId', getUserPostsController);

// Admin routes
postRoutes.get('/admin/moderation', authorizeRoles([Roles.ADMIN, Roles.EMPLOYEE]), getPostsForModerationController);
postRoutes.get('/admin/reported', authorizeRoles([Roles.ADMIN, Roles.EMPLOYEE]), getReportedPostsController);
postRoutes.put('/:id/status', authorizeRoles([Roles.ADMIN, Roles.EMPLOYEE]), updatePostStatusController);
postRoutes.put('/:id/featured', authorizeRoles([Roles.ADMIN, Roles.EMPLOYEE]), setPostFeatureController);
postRoutes.put('/:id/reports/:reportId', authorizeRoles([Roles.ADMIN, Roles.EMPLOYEE]), resolveReportController);

export default postRoutes;