

import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import { uploadPostMedia } from "../utils/file-uploade";
import {
  createPostSchema,
  postIdSchema,
  updatePostSchema,
  reportPostSchema,
  updatePostStatusSchema,
  resolveReportSchema,
  postQuerySchema,
  moderationQuerySchema,
  reportedPostsQuerySchema
} from "../validation/post.validation";
import {
  getPostsService,
  getPostByIdService,
  createPostService,
  updatePostService,
  deletePostService,
  getPostsForModerationService,
  updatePostStatusService,
  reportPostService,
  getReportedPostsService,
  setPostFeatureService,
  getUserPostsService,
  resolveReportService,
  getFeaturedPostsService
} from "../services/post.service";
import { userIdSchema } from "../validation/user.validation";

// @desc    Get all posts (with filtering, pagination)
// @route   GET /api/posts
// @access  Public (but can filter private posts for admin)
export const getPostsController = asyncHandler(
  async (req: Request, res: Response) => {
    const query = postQuerySchema.parse(req.query);
    const { posts, pagination } = await getPostsService({
      query,
      user: req.user
    });

    return res.status(HTTPSTATUS.OK).json({
      posts,
      pagination
    });
  }
);

// @desc    Get post by ID
// @route   GET /api/posts/:id
// @access  Mixed (public for public posts, private for others)
export const getPostByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const postId = postIdSchema.parse(req.params.id);
    const { post, comments, reactions } = await getPostByIdService({
      postId,
      user: req.user
    });

    return res.status(HTTPSTATUS.OK).json({
      post,
      comments,
      reactions
    });
  }
);

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
export const createPostController = [
  uploadPostMedia.array("media", 10), // Allow up to 10 media files
  asyncHandler(async (req: Request, res: Response) => {
    const body = createPostSchema.parse(req.body);
    const { post } = await createPostService({
      body,
      user: req.user,
      files: req.files as Express.Multer.File[]
    });

    return res.status(HTTPSTATUS.CREATED).json(post);
  })
];

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private (author or admin)
export const updatePostController = asyncHandler(
  async (req: Request, res: Response) => {
    const postId = postIdSchema.parse(req.params.id);
    const body = updatePostSchema.parse(req.body);
    const { post } = await updatePostService({
      postId,
      body,
      user: req.user
    });

    return res.status(HTTPSTATUS.OK).json(post);
  }
);

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private (author or admin)
export const deletePostController = asyncHandler(
  async (req: Request, res: Response) => {
    const postId = postIdSchema.parse(req.params.id);
    const { message } = await deletePostService({
      postId,
      user: req.user
    });

    return res.status(HTTPSTATUS.OK).json({ message });
  }
);

// @desc    Admin: Get all posts for moderation
// @route   GET /api/posts/admin/moderation
// @access  Private (Admin only)
export const getPostsForModerationController = asyncHandler(
  async (req: Request, res: Response) => {
    const query = moderationQuerySchema.parse(req.query);
    const { posts, pagination } = await getPostsForModerationService({
      query,
      user: req.user
    });

    return res.status(HTTPSTATUS.OK).json({
      posts,
      pagination
    });
  }
);

// @desc    Admin: Update post status (moderate)
// @route   PUT /api/posts/:id/status
// @access  Private (Admin only)
export const updatePostStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const postId = postIdSchema.parse(req.params.id);
    const body = updatePostStatusSchema.parse(req.body);
    const { message, post } = await updatePostStatusService({
      postId,
      body,
      user: req.user
    });

    return res.status(HTTPSTATUS.OK).json({
      message,
      post
    });
  }
);

// @desc    Report a post
// @route   POST /api/posts/:id/report
// @access  Private
export const reportPostController = asyncHandler(
  async (req: Request, res: Response) => {
    const postId = postIdSchema.parse(req.params.id);
    const body = reportPostSchema.parse(req.body);
    const { message, reportCount } = await reportPostService({
      postId,
      body,
      user: req.user
    });

    return res.status(HTTPSTATUS.OK).json({
      message,
      reportCount
    });
  }
);

// @desc    Admin: Get reported posts
// @route   GET /api/posts/admin/reported
// @access  Private (Admin only)
export const getReportedPostsController = asyncHandler(
  async (req: Request, res: Response) => {
    const query = reportedPostsQuerySchema.parse(req.query);
    const { posts, pagination } = await getReportedPostsService({
      query,
    });

    return res.status(HTTPSTATUS.OK).json({
      posts,
      pagination
    });
  }
);

// @desc    Admin: Resolve a post report
// @route   PUT /api/posts/:id/reports/:reportId
// @access  Private (Admin only)
export const resolveReportController = asyncHandler(
  async (req: Request, res: Response) => {
    const postId = postIdSchema.parse(req.params.id);
    const reportId = req.params.reportId;
    const body = resolveReportSchema.parse(req.body);
    const { message, post } = await resolveReportService({
      postId,
      reportId,
      body,
      user: req.user
    });

    return res.status(HTTPSTATUS.OK).json({
      message,
      post
    });
  }
);

// @desc    Get featured posts (for homepage)
// @route   GET /api/posts/featured
// @access  Public
export const getFeaturedPostsController = asyncHandler(
  async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5;
    const { posts } = await getFeaturedPostsService({ limit });

    return res.status(HTTPSTATUS.OK).json({ posts });
  }
);

// @desc    Admin: Set a post as featured
// @route   PUT /api/posts/:id/featured
// @access  Private (Admin/Employee)
export const setPostFeatureController = asyncHandler(
  async (req: Request, res: Response) => {
    const postId = postIdSchema.parse(req.params.id);
    const featured = req.body.featured !== undefined ? Boolean(req.body.featured) : undefined;
    
    if (featured === undefined) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({ 
        message: "Featured status is required" 
      });
    }

    const { message, post } = await setPostFeatureService({
      postId,
      featured,
      user: req.user
    });

    return res.status(HTTPSTATUS.OK).json({
      message,
      post
    });
  }
);

// @desc    Get user's own posts
// @route   GET /api/posts/my-posts
// @access  Private
export const getUserPostsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = userIdSchema.parse(req.params.userId);
    const query = postQuerySchema.parse(req.query);
    const { posts, pagination } = await getUserPostsService({
      query,
      userId 
    });

    return res.status(HTTPSTATUS.OK).json({
      posts,
      pagination
    });
  }
);