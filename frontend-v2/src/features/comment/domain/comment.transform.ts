import type { AddComment, CommentsQuery } from '@/features/comment/domain/comment-state';
import type {
  AddCommentDto,
  CommentDto,
  CommentsQueryDto,
} from '@/features/comment/domain/comment.dto';
import type { Comment } from '@/features/comment/domain/comment.entity';

// features/comment/domain/comment.transform.ts

export const mapCommentDtoToEntity = (dto: CommentDto): Comment => ({
  id: dto._id,
  postId: dto.postId,
  author: {
    id: dto.authorId._id,
    fullName: dto.authorId.fullName,
    avatarUrl: dto.authorId.profilePicture?.url ?? null,
  },
  content: dto.content,
  stats: {
    likeCount: dto.stats.likeCount,
    replyCount: dto.stats.replyCount,
  },
  replies: dto.replies.map(mapCommentDtoToEntity),
  createdAt: new Date(dto.createdAt),
  updatedAt: new Date(dto.updatedAt),
});

export const mapCommentsDtoToEntities = (dtos: CommentDto[]) => dtos.map(mapCommentDtoToEntity);

// =====================
// State to Dto
// =====================
export const mapAddCommentToDto = (state: AddComment): AddCommentDto => {
  return {
    content: state.content,
  };
};
export const mapCommentsQueryToDto = (
  state: CommentsQuery & { page: number },
): CommentsQueryDto => {
  return {
    page: state.page,
    limit: state.limit,
    postId: state.postId,
  };
};
