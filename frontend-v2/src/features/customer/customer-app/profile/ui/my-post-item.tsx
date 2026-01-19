import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { MessageCircle } from 'lucide-react';
import { useState } from 'react';

import { usePostReactionController } from '@/features/customer/customer-app/profile/application/use-post-reaction-controller';
import { PostComments } from '@/features/post/customer-app/feeds/widget/post-comment';
import type { Post } from '@/features/post/domain/post.entity';
import { ReactionPicker } from '@/features/reaction/components/reaction-picker';
import { getReactionMeta } from '@/features/reaction/config';
import type { ReactionType } from '@/features/reaction/domain/reaction-entity';
import { BlurImage } from '@/shared/components/blur-image';
import { getInitials } from '@/shared/lib/utils';
import { AspectRatio } from '@/shared/ui/aspect-ratio';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/shared/ui/carousel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';

export function MyPostItem({ post }: { post: Post }) {
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const { onReact } = usePostReactionController(post);

  const reactions = post.reactionSummary;
  const stats = post.stats;

  const handleCommentClick = () => {
    setIsCommentOpen((v) => !v);
  };

  return (
    <article className="border-border border-b py-8 last:border-b-0">
      <div className="mb-6 flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={post.author.avatarUrl ?? undefined} />
          <AvatarFallback className="bg-primary/10 text-primary text-sm">
            {getInitials(post.author.fullName)}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col">
          <span className="text-sm font-semibold">{post.author.fullName}</span>
          <time className="text-muted-foreground text-xs">
            {formatDistanceToNow(new Date(post.updatedAt), { addSuffix: true, locale: vi })}
          </time>
        </div>
      </div>

      {post.title && (
        <div className="mb-4">
          <h2 className="text-foreground text-lg font-semibold">{post.title}</h2>
        </div>
      )}

      <div className="mb-6">
        <p className="text-foreground text-base leading-relaxed text-pretty">{post.content}</p>
      </div>

      <PostMedia media={post.media} />
      {post.tags && post.tags.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="hover:bg-accent hover:text-accent-foreground cursor-pointer text-xs transition-colors"
            >
              #{tag}
            </Badge>
          ))}
        </div>
      )}

      <PostReactions
        reactions={reactions.byType}
        totalReactions={reactions.total}
        userReaction={reactions.userReaction}
        comments={stats.commentCount}
        onReactionChange={onReact}
        onComment={handleCommentClick}
      />

      {/* Comments section - collapsible */}
      {isCommentOpen && <PostComments postId={post.id} commentCount={stats.commentCount} />}
    </article>
  );
}
function PostMedia({ media }: { media: Post['media'] }) {
  if (!media?.length) return null;

  if (media.length === 1) {
    return <SingleMedia media={media[0]} />;
  }

  return <MediaCarousel media={media} />;
}
function SingleMedia({ media }: { media: Post['media'][0] }) {
  return (
    <div className="mb-8">
      <Dialog modal>
        <DialogTrigger asChild>
          <div className="border-border bg-secondary cursor-pointer overflow-hidden rounded-lg border transition-opacity hover:opacity-95">
            <AspectRatio ratio={16 / 9}>
              {media.type === 'image' ? (
                <BlurImage src={media.url} alt="Post media" className="h-full w-full" />
              ) : (
                <video src={media.url} controls className="h-full w-full object-cover" />
              )}
            </AspectRatio>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-4xl border-0 bg-black/90 p-0">
          <DialogHeader className="hidden">
            <DialogTitle className="sr-only">Chi tiết đính kèm bài viết</DialogTitle>
            <DialogDescription className="sr-only">Nội dung đính kèm bài bài</DialogDescription>
          </DialogHeader>
          {media.type === 'image' ? (
            <BlurImage src={media.url} alt="Post media" className="h-full w-full" />
          ) : (
            <video src={media.url} controls autoPlay className="h-auto w-full" />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MediaCarousel({ media }: { media: Post['media'] }) {
  return (
    <div className="relative mb-8">
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
      >
        <CarouselContent>
          {media.map((media, idx) => (
            <CarouselItem key={idx} className="basis-full">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="border-border bg-secondary cursor-pointer overflow-hidden rounded-lg border transition-opacity hover:opacity-95">
                    <AspectRatio ratio={16 / 9}>
                      {media.type === 'image' ? (
                        <BlurImage src={media.url} alt={`Post media ${idx + 1}`} />
                      ) : (
                        <video src={media.url} controls className="h-full w-full object-cover" />
                      )}
                    </AspectRatio>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl border-0 p-0">
                  <DialogHeader className="sr-only hidden">
                    <DialogTitle className="sr-only">Chi tiết đính kèm bài viết</DialogTitle>
                    <DialogDescription className="sr-only">
                      Nội dung đính kèm bài viết
                    </DialogDescription>
                  </DialogHeader>
                  {media.type === 'image' ? (
                    <BlurImage src={media.url} alt={`Post media ${idx + 1}`} />
                  ) : (
                    <video src={media.url} controls autoPlay className="h-auto w-full" />
                  )}
                </DialogContent>
              </Dialog>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 md:-left-10" />
        <CarouselNext className="right-2 md:-right-10" />
      </Carousel>
      <div className="bg-muted text-muted-foreground absolute right-2 bottom-2 rounded-md px-2 py-1 text-xs">
        {media.length} đính kèm
      </div>
    </div>
  );
}

interface PostReactionsProps {
  reactions: Record<ReactionType, number>;
  totalReactions: number;
  userReaction: ReactionType | null;
  comments: number;
  onReactionChange: (reactionType: ReactionType) => void;
  onComment: () => void;
}
export function PostReactions({
  reactions,
  totalReactions,
  userReaction,
  comments,
  onReactionChange,
  onComment,
}: PostReactionsProps) {
  // Get non-zero reactions for display
  const activeReactions = Object.entries(reactions)
    .filter(([, r]) => r > 0)
    .sort((a, b) => b[1] - a[1]);

  return (
    <div className="border-border/50 border-t pt-6">
      {/* Reaction counts summary - click to show who reacted */}
      {totalReactions > 0 && (
        <div className="text-muted-foreground mb-4 flex items-center gap-2 text-sm">
          <div className="flex -space-x-1">
            {activeReactions.slice(0, 3).map(([type]) => (
              <span key={type} className="text-lg">
                {getReactionMeta(type as ReactionType).emoji}
              </span>
            ))}
          </div>
          <span className="text-xs">{totalReactions} tương tác</span>
        </div>
      )}

      <div className="flex items-center gap-4">
        <ReactionPicker currentReaction={userReaction} onReactionSelect={onReactionChange} />

        <Button variant="ghost" size="sm" onClick={onComment}>
          <MessageCircle size={20} />
          <span className="text-sm font-medium">{comments}</span>
        </Button>
      </div>
    </div>
  );
}
