export type CommentType = {
  _id: string;
  postId: string;
  authorId: string;
  content: string;
  parentCommentId?: string;
  status: 'active' | 'blocked' | 'deleted';
  createdAt: Date;
  updatedAt: Date;
  replies?: Comment[];
}