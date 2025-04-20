export type PostStatsType = {
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  reportCount?: number;
}


export type CommentType = {
  _id: string;
  postId: string;
  authorId: {
    _id: string;
    fullName: string;
    profilePicture?: {
      url: string;
      publicId: string;
    };
  };
  content: string;
  parentCommentId?: string;
  status: "active" | "blocked" | "deleted";
  createdAt: string;
  updatedAt: string;
  replies?: CommentType[];
  replyCount?: number;
  stats?: {
    likeCount: number;
    replyCount: number;
  };
};

export type PaginationResultType = {
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
};

export type CommentsResponseType = {
  message: string;
  comments: CommentType[];
  pagination: PaginationResultType;
};

export type GetCommentParamsType = {
  page: number;
  postId: string;
  parentId?: string
}