// components/comments/CommentsSection.tsx
import React, { useState } from 'react';
import { useGetComments } from '../hooks/queries/get-comments';
import { CommentItem } from './comment-item'; 
import { CommentForm } from './comment-form'; 
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface CommentListProps {
  postId: string;
  currentUser?: {
    _id: string;
    role?: string;
  };
}

export const CommentList: React.FC<CommentListProps> = ({
  postId,
  currentUser
}) => {
  const [replyToId, setReplyToId] = useState<string | null>(null);
  
  // Fetch comments with infinite query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error
  } = useGetComments(postId);
  
  // Fetch replies for a specific comment when viewing more replies
  const {
    data: repliesData,
    fetchNextPage: fetchMoreReplies,
    isFetchingNextPage: isFetchingMoreReplies,
    hasNextPage: hasMoreReplies
  } = useGetComments(postId, replyToId || undefined);
  
  const handleReplyClick = (commentId: string) => {
    setReplyToId(commentId === replyToId ? null : commentId);
  };
  
  // Loading state
  if (status === 'pending') {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex space-x-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  // Error state
  if (status === 'error') {
    return (
      <div className="py-4 text-center">
        <p className="text-red-500">
          {error instanceof Error ? error.message : 'Lỗi tải bình luận'}
        </p>
        <Button 
          variant="outline" 
          className="mt-2"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }
  
  // Empty state
  if (data?.pages[0].comments.length === 0) {
    return (
      <div>
        <p className="text-center text-gray-500 my-4">No comments yet. Be the first to comment!</p>
        {currentUser && (
          <CommentForm
            postId={postId}
            placeholder="Bình luận..."
          />
        )}
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {/* Comment form for adding new top-level comments */}
      {currentUser && (
        <CommentForm
          postId={postId}
          placeholder="Bình luận..."
        />
      )}
      
      {/* Comments list */}
      <div className="divide-y divide-gray-100">
        {data?.pages.map((page, i) => (
          <React.Fragment key={i}>
            {page.comments.map((comment) => (
              <div key={comment._id}>
                <CommentItem
                  comment={comment}
                  postId={postId}
                  currentUser={currentUser}
                  onReplyClick={handleReplyClick}
                />
                
                {/* Show reply form when a comment is selected for reply */}
                {replyToId === comment._id && (
                  <div className="ml-12 mt-2">
                    {currentUser && (
                      <CommentForm
                        postId={postId}
                        parentCommentId={comment._id}
                        placeholder="Phản hồi..."
                        autoFocus={true}
                        onSuccess={() => {
                          // You could auto-close the reply form after submission
                          // or keep it open to allow multiple replies
                        }}
                      />
                    )}
                    
                    {/* Display additional replies loaded via "View more replies" */}
                    {repliesData?.pages.map((page, j) => (
                      <React.Fragment key={j}>
                        {page.comments.map((reply) => (
                          <CommentItem
                            key={reply._id}
                            comment={reply}
                            postId={postId}
                            currentUser={currentUser}
                            onReplyClick={handleReplyClick}
                          />
                        ))}
                      </React.Fragment>
                    ))}
                    
                    {/* Load more button for replies */}
                    {hasMoreReplies && (
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => fetchMoreReplies()}
                        disabled={isFetchingMoreReplies}
                        className="text-xs"
                      >
                        {isFetchingMoreReplies ? 'Đang tải bình luận...' : 'Xem thêm phản hồi'}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
      
      {/* Load more comments button */}
      {hasNextPage && (
        <div className="mt-6 text-center">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant="outline"
          >
            {isFetchingNextPage ? 'Đang tải thêm bình luận...' : 'Xem thêm bình luận'}
          </Button>
        </div>
      )}
    </div>
  );
};