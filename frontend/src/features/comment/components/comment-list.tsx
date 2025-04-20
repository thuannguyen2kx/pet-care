import React, { useState } from 'react';
import { useGetComments } from '@/features/comment/hooks/queries/get-comments';
import { CommentItem } from './comment-item'; 
import { CommentForm } from './comment-form'; 
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

interface CommentListProps {
  postId: string;
  currentUser?: {
    _id: string;
    role?: string;
  } | null;
}

export const CommentList: React.FC<CommentListProps> = ({
  postId,
  currentUser
}) => {
  const [replyToId, setReplyToId] = useState<string | null>(null);
  
  // Fetch top-level comments with infinite query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
    refetch
  } = useGetComments(postId);
  
  // Fetch replies for a specific comment when viewing more replies
  const {
    data: repliesData,
    fetchNextPage: fetchMoreReplies,
    isFetchingNextPage: isFetchingMoreReplies,
    hasNextPage: hasMoreReplies,
    refetch: refetchReplies
  } = useGetComments(postId, replyToId || undefined);
  
  // Handle reply button click - toggle reply form and load replies
  const handleReplyClick = (commentId: string) => {
    if (commentId === replyToId) {
      setReplyToId(null);
    } else {
      setReplyToId(commentId);
      // Refetch replies when expanding a comment
      refetchReplies();
    }
  };
  
  // Loading state
  if (status === 'pending') {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex space-x-3">
            <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
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
          onClick={() => refetch()}
        >
          Thử lại
        </Button>
      </div>
    );
  }
  
  // No comments yet
  if (data?.pages[0].comments.length === 0) {
    return (
      <div>
        <p className="text-center text-gray-500 my-4">Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
        {currentUser && (
          <CommentForm
            postId={postId}
            placeholder="Viết bình luận..."
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
          placeholder="Viết bình luận..."
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
                  showReplyForm={replyToId === comment._id}
                />
                
                {/* Display additional replies loaded via "View more replies" */}
                {replyToId === comment._id && repliesData?.pages && (
                  <div className="ml-8 mt-1">
                    {repliesData.pages.map((page, j) => (
                      <React.Fragment key={`reply-page-${j}`}>
                        {page.comments
                          .filter(reply => !comment.replies?.some(r => r._id === reply._id))
                          .map((reply) => (
                            <CommentItem
                              key={reply._id}
                              comment={reply}
                              postId={postId}
                              currentUser={currentUser}
                              onReplyClick={handleReplyClick}
                              level={1}
                            />
                          ))}
                      </React.Fragment>
                    ))}
                    
                    {/* Load more button for replies */}
                    {hasMoreReplies && (
                      <div className="text-center mt-2">
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => fetchMoreReplies()}
                          disabled={isFetchingMoreReplies}
                          className="text-xs"
                        >
                          {isFetchingMoreReplies ? (
                            <>
                              <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                              Đang tải...
                            </>
                          ) : (
                            'Xem thêm phản hồi'
                          )}
                        </Button>
                      </div>
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
        <div className="text-center mt-6">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant="link"
            className="w-full"
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang tải thêm bình luận...
              </>
            ) : (
              'Xem thêm bình luận'
            )}
          </Button>
        </div>
      )}
    </div>
  );
};