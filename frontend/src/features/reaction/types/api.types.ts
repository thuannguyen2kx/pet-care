// Define types for reaction-related features

export type ReactionItemType = 'like' | 'love' | 'laugh' | 'sad' | 'angry';

export type ContentType = 'post' | 'comment';

export interface ReactionType {
  _id: string;
  userId: string;
  contentType: ContentType;
  contentId: string;
  reactionType: ReactionItemType;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserReactionResponse {
  reaction: ReactionType | null;
}

export interface ReactionCounts {
  like: number;
  love: number;
  laugh: number;
  sad: number;
  angry: number;
  total: number;
}

export interface ReactionsResponse {
  counts: ReactionCounts;
  topReactors?: {
    userId: {
      _id: string;
      fullName: string;
      profilePicture?: {
        url: string;
      };
    };
    reactionType: ReactionItemType;
  }[];
}

export interface AddReactionRequest {
  contentType: ContentType;
  contentId: string;
  reactionType: ReactionItemType;
}

export interface RemoveReactionRequest {
  contentType: ContentType;
  contentId: string;
}