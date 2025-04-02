export type ReactionItemType = "like" | "love" | "laugh" | "sad" | "angry";
export type ContentType = "posts" | "comments";

export type UserType  ={
  _id: string;
  fullName: string;
  profilePicture?: {
    url: string;
    publicId: string;
  };
}

export type ReactionType = {
  _id: string;
  contentType: "post" | "comment";
  contentId: string;
  userId: UserType;
  reactionType: ReactionItemType;
  createdAt: string;
}

export type ReactionCountsType = {
  like: number;
  love: number;
  laugh: number;
  sad: number;
  angry: number;
  total: number;
}

export type ReactionsResponseType = {
  message: string;
  reactions: ReactionType[];
  counts: ReactionCountsType;
}

export type UserReactionResponse = {
  message: string;
  reaction: ReactionType | null;
}