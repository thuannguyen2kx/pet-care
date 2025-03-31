import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  postId: mongoose.Types.ObjectId | string;
  authorId: mongoose.Types.ObjectId | string;
  content: string;
  parentCommentId?: mongoose.Types.ObjectId | string;
  status: 'active' | 'blocked' | 'deleted';
  createdAt: Date;
  updatedAt: Date;
  // Thêm trường này để TypeScript biết về thuộc tính replies
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
  }
}, {
  timestamps: true
});

const CommentModel = mongoose.model<IComment>('Comment', CommentSchema);

export default CommentModel;