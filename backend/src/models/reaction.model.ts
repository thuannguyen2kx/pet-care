import { Schema, model, Types, HydratedDocument } from "mongoose";

export interface IReaction {
  contentType: "Post" | "Comment";
  contentId: Types.ObjectId;
  userId: Types.ObjectId;
  reactionType: "like" | "love" | "laugh" | "sad" | "angry";
  createdAt: Date;
  updatedAt: Date;
}

export type ReactionDocument = HydratedDocument<IReaction>;

const ReactionSchema = new Schema<IReaction>(
  {
    contentType: {
      type: String,
      enum: ["Post", "Comment"],
      required: true,
    },
    contentId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "contentType",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reactionType: {
      type: String,
      enum: ["like", "love", "laugh", "sad", "angry"],
      default: "like",
    },
  },
  { timestamps: true },
);

ReactionSchema.index(
  { contentType: 1, contentId: 1, userId: 1 },
  { unique: true },
);
ReactionSchema.index({ contentId: 1, reactionType: 1 });
ReactionSchema.index({ userId: 1, createdAt: -1 });

export const ReactionModel = model<IReaction>("Reaction", ReactionSchema);
