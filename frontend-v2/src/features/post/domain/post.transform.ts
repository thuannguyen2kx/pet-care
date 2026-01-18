import type { PostDto, PostsQuery } from '@/features/post/domain/post.dto';
import type { Post } from '@/features/post/domain/post.entity';
import type { CreatePost, CustomerPostsQuery } from '@/features/post/domain/post.state';

// ======================
// State => Dto
// ======================
export const mapCreatePostToDto = (state: CreatePost): FormData => {
  const formData = new FormData();
  formData.append('title', state.title || '');
  formData.append('content', state.content);
  formData.append('tags', state.tags?.map((tag) => tag.value).join(',') || '');
  formData.append('petIds', state.petIds || '');
  formData.append('visibility', state.visibility);

  // Add media files
  if (state.media?.added) {
    state.media.added.forEach((item) => {
      formData.append('media', item.file);
    });
  }

  return formData;
};

export const mapCustomerPostQueryToDto = (
  state: CustomerPostsQuery & { page: number },
): PostsQuery => {
  return {
    page: state.page,
    limit: state.limit,
  };
};

// ======================
// Dto => Entity
// ======================

export const mapPostDtoToEntity = (dto: PostDto): Post => {
  return {
    id: dto._id,

    author: {
      id: dto.authorId._id,
      fullName: dto.authorId.fullName,
      avatarUrl: dto.authorId.profilePicture?.url ?? null,
    },

    title: dto.title,
    content: dto.content,
    tags: dto.tags,
    petIds: dto.petIds,

    visibility: dto.visibility,
    status: dto.status,
    isFeatured: dto.isFeatured,

    stats: dto.stats,

    media: dto.media.map((m) => ({
      publicId: m.publicId,
      url: m.url,
      type: m.type,
    })),

    reactionSummary: dto.reactionSummary,

    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  };
};
export const mapPostsDtoToEntities = (dtos: PostDto[]): Post[] => {
  return dtos.map((dto) => mapPostDtoToEntity(dto));
};
