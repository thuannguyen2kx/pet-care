// reaction.validation.ts
import mongoose from "mongoose";
import { z } from "zod";

// Validate content ID
export const contentIdSchema = z.string().refine(
  (id) => mongoose.Types.ObjectId.isValid(id),
  {
    message: "Invalid content ID format"
  }
);
// Content type schema
export const contentTypeSchema = z.enum(["post", "comment"], {
  errorMap: () => ({
    message: "Content type must be either 'post' or 'comment'",
  }),
});

// Reaction type schema
export const reactionTypeSchema = z.enum(
  ["like", "love", "laugh", "sad", "angry"],
  {
    errorMap: () => ({
      message: "Reaction type must be one of: like, love, laugh, sad, angry",
    }),
  }
);

// Create reaction schema
export const createReactionSchema = z.object({
  reactionType: reactionTypeSchema,
});

// Validate pagination parameters
export const paginationSchema = z.object({
  page: z.number().positive().default(1),
  limit: z.number().positive().max(100).default(20)
});

// Validate request payload for adding a reaction
export const addReactionPayloadSchema = z.object({
  reactionType: reactionTypeSchema
});

// Validate query parameters for reaction filtering
export const reactionFilterSchema = z.object({
  reactionType: reactionTypeSchema.optional()
});
