import { Schema, model, Types, HydratedDocument } from "mongoose";

/* =======================
 * Interfaces
 * ======================= */

export interface IMedia {
  type: "image" | "video";
  url: string;
  publicId: string;
}

export interface IStats {
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  reportCount: number;
}

export interface IModerationNote {
  moderatorId: Types.ObjectId;
  note: string;
  createdAt: Date;
}

export interface IReport {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  reason: string;
  details?: string;
  createdAt: Date;
  status: "pending" | "resolved" | "rejected";
  response?: string;
  resolvedAt?: Date;
  resolvedBy?: Types.ObjectId;
}

export interface IPost {
  authorId: Types.ObjectId;
  title?: string;
  content: string;
  tags: string[];
  petIds: Types.ObjectId[];
  media?: IMedia[];
  visibility: "public" | "private";
  status: "active" | "under-review" | "blocked";
  isFeatured: boolean;
  stats: IStats;
  reports?: IReport[];
  moderationNotes?: IModerationNote[];
  createdAt: Date;
  updatedAt: Date;
}

export type PostDocument = HydratedDocument<IPost>;

/* =======================
 * Sub Schemas
 * ======================= */

const MediaSchema = new Schema<IMedia>(
  {
    type: { type: String, enum: ["image", "video"], required: true },
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false },
);

const StatsSchema = new Schema<IStats>(
  {
    viewCount: { type: Number, default: 0 },
    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 },
    reportCount: { type: Number, default: 0 },
  },
  { _id: false },
);

const ModerationNoteSchema = new Schema<IModerationNote>(
  {
    moderatorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    note: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const ReportSchema = new Schema<IReport>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  reason: { type: String, required: true },
  details: String,
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["pending", "resolved", "rejected"],
    default: "pending",
  },
  response: String,
  resolvedAt: Date,
  resolvedBy: { type: Schema.Types.ObjectId, ref: "User" },
});

/* =======================
 * Post Schema
 * ======================= */

const PostSchema = new Schema<IPost>(
  {
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: String,
    content: { type: String, required: true },
    tags: { type: [String], default: [] },
    petIds: [{ type: Schema.Types.ObjectId, ref: "Pet" }],
    media: [MediaSchema],
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    status: {
      type: String,
      enum: ["active", "under-review", "blocked"],
      default: "active",
    },
    isFeatured: { type: Boolean, default: false },
    stats: {
      type: StatsSchema,
      default: () => ({}),
    },
    reports: [ReportSchema],
    moderationNotes: [ModerationNoteSchema],
  },
  { timestamps: true },
);

/* =======================
 * Indexes
 * ======================= */

PostSchema.index({ authorId: 1, createdAt: -1 });
PostSchema.index({ "stats.likeCount": -1 });
PostSchema.index({ createdAt: -1 });

export const PostModel = model<IPost>("Post", PostSchema);
