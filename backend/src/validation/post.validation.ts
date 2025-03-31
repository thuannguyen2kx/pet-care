
import { z } from 'zod';

// Post ID validation
export const postIdSchema = z.string().trim().min(1, {message: 'Post ID is required'});

// Post query parameters validation
export const postQuerySchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
  tag: z.string().trim().optional(),
  author: z.string().trim().optional(),
  petId: z.string().trim().optional(),
  status: z.enum(['active', 'under-review', 'blocked', 'all']).optional(),
  visibility: z.enum(['public', 'private', 'all']).optional(),
  search: z.string().trim().optional(),
  sortBy: z.enum([
    'createdAt', 
    'updatedAt', 
    'stats.viewCount', 
    'stats.likeCount', 
    'stats.commentCount'
  ]).optional().default('createdAt'),
  sortDirection: z.enum(['asc', 'desc']).optional().default('desc')
});

// Moderation query parameters validation
export const moderationQuerySchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
  status: z.enum(['active', 'under-review', 'blocked', 'all']).optional().default('all'),
  reportCount: z.coerce.number().min(0).optional().default(0),
  sortBy: z.enum([
    'createdAt', 
    'updatedAt', 
    'stats.viewCount', 
    'stats.likeCount', 
    'stats.commentCount', 
    'reportCount'
  ]).optional().default('createdAt'),
  sortDirection: z.enum(['asc', 'desc']).optional().default('desc')
});

// Reported posts query parameters validation
export const reportedPostsQuerySchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
  status: z.enum(['pending', 'resolved', 'rejected', 'all']).optional().default('pending'),
  sortBy: z.enum([
    'createdAt', 
    'reportCount'
  ]).optional().default('reportCount'),
  sortDirection: z.enum(['asc', 'desc']).optional().default('desc')
});

// Create post validation
export const createPostSchema = z.object({
  title: z.string().trim().max(200).optional(),
  content: z.string().trim().min(1, 'Post content is required'),
  tags: z.string().trim().optional(),
  petIds: z.string().trim().optional(),
  visibility: z.enum(['public', 'private']).optional().default('public')
});

// Update post validation
export const updatePostSchema = z.object({
  title: z.string().trim().max(200).optional(),
  content: z.string().trim().min(1).optional(),
  tags: z.string().trim().optional(),
  petIds: z.string().trim().optional(),
  visibility: z.enum(['public', 'private']).optional(),
  status: z.enum(['active', 'under-review', 'blocked']).optional()
}).partial();

// Report post validation
export const reportPostSchema = z.object({
  reason: z.enum([
    'spam', 
    'harassment', 
    'hate-speech', 
    'inappropriate-content', 
    'violence', 
    'copyright', 
    'other'
  ]),
  details: z.string().trim().max(500).optional()
});

// Update post status validation
export const updatePostStatusSchema = z.object({
  status: z.enum(['active', 'under-review', 'blocked']),
  moderationNote: z.string().trim().max(500).optional()
});

// Resolve report validation
export const resolveReportSchema = z.object({
  status: z.enum(['resolved', 'rejected']),
  response: z.string().trim().max(500).optional()
});