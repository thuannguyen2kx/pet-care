// reaction.validation.ts
import { z } from "zod";

// Content type schema
export const contentTypeSchema = z.enum(["post", "comment"], {
  errorMap: () => ({
    message: "Content type must be either 'post' or 'comment'",
  }),
});

// Content ID schema
export const contentIdSchema = z
  .string()
  .min(1, "Content ID is required")
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid content ID format");

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
