import mongoose, { Document, Schema } from 'mongoose';

export interface IReaction extends Document {
  contentType: 'post' | 'comment';
  contentId: mongoose.Types.ObjectId | string;
  userId: mongoose.Types.ObjectId | string;
  reactionType: 'like' | 'love' | 'laugh' | 'sad' | 'angry';
  createdAt: Date;
}

const ReactionSchema = new Schema({
  contentType: {
    type: String,
    enum: ['post', 'comment'],
    required: true
  },
  contentId: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'contentType'
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reactionType: {
    type: String,
    enum: ['like', 'love', 'laugh', 'sad', 'angry'],
    default: 'like'
  }
}, {
  timestamps: true
});

// Đảm bảo một người dùng chỉ có thể có một reaction trên mỗi nội dung
ReactionSchema.index({ contentType: 1, contentId: 1, userId: 1 }, { unique: true });

const ReactionModel = mongoose.model<IReaction>('Reaction', ReactionSchema);

export default ReactionModel;