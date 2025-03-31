import mongoose, { Document, Schema } from 'mongoose';

// Định nghĩa interfaces để TypeScript biết đầy đủ các trường

export interface IMedia {
  type: 'image' | 'video';
  url: string;
  publicId: string;
}

export interface IStats {
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  reportCount?: number;
}

export interface IModerationNote {
  moderatorId: mongoose.Types.ObjectId | string;
  note: string;
  createdAt: Date;
}

export interface IReport {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId | string;
  reason: string;
  details?: string;
  createdAt: Date;
  status: 'pending' | 'resolved' | 'rejected';
  response?: string;
  resolvedAt?: Date;
  resolvedBy?: mongoose.Types.ObjectId | string;
}

export interface IPost extends Document {
  authorId: mongoose.Types.ObjectId | string;
  title?: string;
  content: string;
  tags: string[];
  petIds: mongoose.Types.ObjectId[] | string[];
  media?: IMedia[];
  visibility: 'public' | 'private';
  status: 'active' | 'under-review' | 'blocked';
  isFeatured?: boolean;
  stats: IStats;
  reports?: IReport[];
  moderationNotes?: IModerationNote[];
  createdAt: Date;
  updatedAt: Date;
  engagementStats?: {
    commentCount: number;
    reactionCount: number;
  };
}

const MediaSchema = new Schema({
  type: {
    type: String,
    enum: ['image', 'video'],
    required: true
  },
  url: {
    type: String,
    required: true
  },
  publicId: {
    type: String,
    required: true
  }
});

const StatsSchema = new Schema({
  viewCount: {
    type: Number,
    default: 0
  },
  likeCount: {
    type: Number,
    default: 0
  },
  commentCount: {
    type: Number,
    default: 0
  },
  shareCount: {
    type: Number,
    default: 0
  },
  reportCount: {
    type: Number,
    default: 0
  }
});

const ModerationNoteSchema = new Schema({
  moderatorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  note: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ReportSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  details: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'resolved', 'rejected'],
    default: 'pending'
  },
  response: {
    type: String
  },
  resolvedAt: {
    type: Date
  },
  resolvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

const PostSchema = new Schema({
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String
  },
  content: {
    type: String,
    required: true
  },
  tags: [{
    type: String
  }],
  petIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Pet'
  }],
  media: [MediaSchema],
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  status: {
    type: String,
    enum: ['active', 'under-review', 'blocked'],
    default: 'active'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  stats: {
    type: StatsSchema,
    default: () => ({})
  },
  reports: [ReportSchema],
  moderationNotes: [ModerationNoteSchema]
}, {
  timestamps: true
});

const PostModel = mongoose.model<IPost>('Post', PostSchema);

export default PostModel;