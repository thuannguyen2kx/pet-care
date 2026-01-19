import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Send, Loader2, MessageSquare } from 'lucide-react';
import React, { useState, useRef } from 'react';

import { useComments } from '@/features/comment/api';
import { useAddComment } from '@/features/comment/api/add-comment';
import type { Comment } from '@/features/comment/domain/comment.entity';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Skeleton } from '@/shared/ui/skeleton';

export function AdminPostComments({
  postId,
  commentCount,
}: {
  postId: string;
  commentCount?: number;
}) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const commentsQuery = useComments({
    query: { postId, limit: 10 },
  });

  const addCommentMutation = useAddComment({
    mutationConfig: {
      onSuccess: () => {
        setInput('');
        inputRef.current?.focus();
      },
    },
  });

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || addCommentMutation.isPending) return;

    addCommentMutation.mutate({
      postId,
      content: input.trim(),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const allComments = commentsQuery.data?.pages.flatMap((p) => p.comments) ?? [];
  const hasNextPage = commentsQuery.hasNextPage;
  const isLoadingMore = commentsQuery.isFetchingNextPage;

  return (
    <div className="border-border/50 mt-6 space-y-6 border-t pt-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="text-muted-foreground h-4 w-4" />
        <h3 className="text-foreground text-sm font-medium">
          {commentCount ? `${commentCount} bình luận` : 'Bình luận'}
        </h3>
      </div>

      <CommentComposer
        ref={inputRef}
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
        isSubmitting={addCommentMutation.isPending}
      />

      <CommentList
        comments={allComments}
        isLoading={commentsQuery.isLoading}
        hasNextPage={hasNextPage}
        isLoadingMore={isLoadingMore}
        onLoadMore={() => commentsQuery.fetchNextPage()}
      />
    </div>
  );
}

type CommentListProps = {
  comments: Comment[];
  isLoading: boolean;
  hasNextPage?: boolean;
  isLoadingMore?: boolean;
  onLoadMore: () => void;
};

function CommentList({
  comments,
  isLoading,
  hasNextPage,
  isLoadingMore,
  onLoadMore,
}: CommentListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <CommentSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!comments.length) {
    return (
      <div className="py-8 text-center">
        <MessageSquare className="text-muted-foreground/40 mx-auto h-12 w-12" />
        <p className="text-muted-foreground mt-3 text-sm">
          Chưa có bình luận nào. Hãy là người đầu tiên!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}

      {hasNextPage && (
        <div className="flex justify-center pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="text-muted-foreground hover:text-foreground"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang tải...
              </>
            ) : (
              'Xem thêm bình luận'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

function CommentItem({ comment }: { comment: Comment }) {
  return (
    <div className="group hover:bg-muted/30 space-y-2 rounded-lg p-3 transition-colors">
      <div className="flex items-baseline gap-3">
        <p className="text-foreground text-sm font-medium">{comment.author.fullName}</p>
        <time className="text-muted-foreground text-xs">
          {formatDistanceToNow(new Date(comment.createdAt), {
            locale: vi,
            addSuffix: true,
          })}
        </time>
      </div>
      <p className="text-foreground/90 text-sm leading-relaxed text-pretty">{comment.content}</p>
    </div>
  );
}

function CommentSkeleton() {
  return (
    <div className="space-y-2 p-3">
      <div className="flex items-baseline gap-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}

type CommentComposerProps = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  isSubmitting?: boolean;
};

const CommentComposer = React.forwardRef<HTMLInputElement, CommentComposerProps>(
  ({ value, onChange, onSubmit, onKeyDown, isSubmitting }, ref) => {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="border-border flex gap-2 border-b"
      >
        <div className="relative flex-1">
          <Input
            ref={ref}
            type="text"
            placeholder="Viết bình luận..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={isSubmitting}
            className="border-none pr-10 shadow-none focus-visible:ring-0"
            maxLength={500}
          />
          {value && (
            <span className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 text-xs">
              {value.length}/500
            </span>
          )}
        </div>
        <Button
          type="submit"
          size="icon"
          variant="ghost"
          disabled={!value.trim() || isSubmitting}
          className="hover:bg-primary/10 hover:text-primary shrink-0 transition-all disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    );
  },
);

CommentComposer.displayName = 'CommentComposer';
