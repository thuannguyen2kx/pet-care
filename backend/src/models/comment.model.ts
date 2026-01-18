import { Schema, model, Types, HydratedDocument } from "mongoose";

export interface ICommentStats {
  likeCount: number;
  replyCount: number;
}

export interface IComment {
  postId: Types.ObjectId;
  authorId: Types.ObjectId;
  content: string;
  parentCommentId?: Types.ObjectId;
  status: "active" | "blocked" | "deleted";
  stats: ICommentStats;
  createdAt: Date;
  updatedAt: Date;
}

export type CommentDocument = HydratedDocument<IComment>;

const CommentSchema = new Schema<IComment>(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    parentCommentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    status: {
      type: String,
      enum: ["active", "blocked", "deleted"],
      default: "active",
    },
    stats: {
      likeCount: { type: Number, default: 0 },
      replyCount: { type: Number, default: 0 },
    },
  },
  { timestamps: true },
);

CommentSchema.index({ postId: 1, createdAt: -1 });
CommentSchema.index({ parentCommentId: 1 });
CommentSchema.index({ authorId: 1 });

export const CommentModel = model<IComment>("Comment", CommentSchema);
