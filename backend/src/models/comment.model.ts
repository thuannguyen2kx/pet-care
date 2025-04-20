import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  postId: mongoose.Types.ObjectId | string;
  authorId: mongoose.Types.ObjectId | string;
  content: string;
  parentCommentId?: mongoose.Types.ObjectId | string;
  status: 'active' | 'blocked' | 'deleted';
  stats?: {
    likeCount: number;
    replyCount: number;
  };
  createdAt: Date;
  updatedAt: Date;
  replies?: IComment[];
}

const CommentSchema = new Schema({
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  parentCommentId: {
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  },
  status: {
    type: String,
    enum: ['active', 'blocked', 'deleted'],
    default: 'active'
  },
  // Add stats for reactions and replies
  stats: {
    likeCount: {
      type: Number,
      default: 0
    },
    replyCount: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
CommentSchema.index({ postId: 1, createdAt: -1 });
CommentSchema.index({ authorId: 1 });
CommentSchema.index({ parentCommentId: 1 }); // For finding replies

const CommentModel = mongoose.model<IComment>('Comment', CommentSchema);

export default CommentModel;