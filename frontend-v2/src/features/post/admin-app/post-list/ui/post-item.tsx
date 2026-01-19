import { formatDistanceToNowStrict } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useState } from 'react';

import { useAdminPostReactionController } from '@/features/post/admin-app/post-list/application/use-post-reaction-controller';
import { AdminPostActions } from '@/features/post/admin-app/post-list/ui/post-actions';
import { AdminPostComments } from '@/features/post/admin-app/post-list/ui/post-comments';
import { AdminPostMedia } from '@/features/post/admin-app/post-list/ui/post-media';
import { PostReactions } from '@/features/post/admin-app/post-list/ui/post-reactions';
import type { Post } from '@/features/post/domain/post.entity';
import { getInitials } from '@/shared/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';

type Props = {
  post: Post;
};
export function AdminPostItem({ post }: Props) {
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const { onReact } = useAdminPostReactionController(post);

  const reactions = post.reactionSummary;
  const stats = post.stats;

  const handleCommentClick = () => {
    setIsCommentOpen((v) => !v);
  };
  return (
    <Card className="rounded-none border-none p-4 shadow-none">
      <div className="mb-2 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={post.author.avatarUrl ?? undefined} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm">
              {getInitials(post.author.fullName)}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <span className="text-sm font-semibold">{post.author.fullName}</span>
            <time className="text-muted-foreground text-xs">
              {formatDistanceToNowStrict(new Date(post.updatedAt), { addSuffix: true, locale: vi })}
            </time>
          </div>
        </div>
        <AdminPostActions />
      </div>

      {post.title && <h2 className="text-foreground text-lg font-semibold">{post.title}</h2>}
      <p className="text-foreground text-base leading-relaxed text-pretty">{post.content}</p>
      <AdminPostMedia media={post.media} />
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
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

      {isCommentOpen && <AdminPostComments postId={post.id} commentCount={stats.commentCount} />}
    </Card>
  );
}
