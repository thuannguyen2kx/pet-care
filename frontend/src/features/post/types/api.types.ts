// Define interfaces for Post-related types

import { CommentType } from "@/features/comment/types/api.types";
import { UserType } from "@/features/user/types/api.types";

export type MediaItemType = {
  type: 'image' | 'video';
  url: string;
  publicId?: string;
}

export type PostStatsType = {
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  reportCount?: number;
}

export type ModerationNoteType = {
  moderatorId: string;
  note: string;
  createdAt: Date;
}

export type ReportType = {
  _id: string;
  userId: string | UserType;
  reason: string;
  details?: string;
  createdAt: Date;
  status: 'pending' | 'resolved' | 'rejected';
  response?: string;
  resolvedAt?: Date;
  resolvedBy?: string;
}

type PetType = {
  profilePicture: {
    url: string;
    publicId: string;
  };
  _id: string;
  name: string;
  species: string;
  breed: string;
};
export type PostType = {
  _id: string;
  authorId: {
    profilePicture: {url: string,publicId: string},
    _id: string,
    fullName: string
  };
  title?: string;
  content: string;
  tags: string[];
  petIds: PetType[];
  media?: MediaItemType[];
  visibility: 'public' | 'private';
  status: 'pending' | "resolved" | "rejected";
  isFeatured?: boolean;
  stats: PostStatsType;
  reports?: ReportType[];
  moderationNotes?: ModerationNoteType[];
  createdAt: Date;
  updatedAt: Date;
}


// Request types
export type PostQueryParams = {
  page?: number;
  limit?: number;
  tag?: string;
  author?: string;
  petId?: string;
  status?: string;
  visibility?: string;
  search?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export type ModerationQueryParams = {
  page?: number;
  limit?: number;
  status?: string;
  reportCount?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export type ReportedPostsQueryParams = {
  page?: number;
  limit?: number;
  status?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export type CreatePostBodyType = {
  title?: string;
  content: string;
  tags?: string;
  petIds?: string;
  visibility?: 'public' | 'private';
}

export type UpdatePostBodyType = {
  title?: string;
  content?: string;
  tags?: string;
  petIds?: string;
  visibility?: 'public' | 'private';
  status?: 'active' | 'under-review' | 'blocked';
}
export type ReasonType = 'spam' | 'harassment' | 'hate-speech' | 'inappropriate-content' | 'violence' | 'copyright' | 'other';

export type ReportPostBodyType = {
  reason: 'spam' | 'harassment' | 'hate-speech' | 'inappropriate-content' | 'violence' | 'copyright' | 'other';
  details?: string;
}

export type UpdatePostStatusBody = {
  status: 'active' | 'under-review' | 'blocked';
  moderationNote?: string;
}

export type ResolveReportBodyType = {
  status: 'resolved' | 'rejected';
  response?: string;
}

// Response types
export type PaginationResponseType = {
  totalPosts: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export type PostsResponseType = {
  posts: PostType[];
  pagination: PaginationResponseType;
}

export type PostResponseType = {
  post: PostType;
  comments: CommentType[];
  reactions: {
    total: number;
    types: Record<string, number>;
    userReaction: string | null;
  };
}

export type ReportResponseType = {
  message: string;
  reportCount: number;
}

export type StatusUpdateResponseType = {
  message: string;
  post: PostType;
}

export type FeatureResponseType = {
  message: string;
  post: PostType;
}
