// comment.validation.ts
import { z } from "zod";

// Post ID schema
export const postIdSchema = z
  .string()
  .min(1, "Post ID is required")
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid post ID format");

// Comment ID schema
export const commentIdSchema = z
  .string()
  .min(1, "Comment ID is required")
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid comment ID format");

// Parent comment ID schema (optional)
export const parentCommentIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid parent comment ID format");

// Comment content schema
export const commentContentSchema = z
  .string()
  .min(1, "Comment content is required")
  .max(1000, "Comment must be between 1 and 1000 characters");

// Create comment schema
export const createCommentSchema = z.object({
  content: commentContentSchema,
  parentCommentId: parentCommentIdSchema.optional(),
});

// Update comment schema
export const updateCommentSchema = z.object({
  content: commentContentSchema,
});
