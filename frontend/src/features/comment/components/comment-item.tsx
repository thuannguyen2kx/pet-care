// components/comments/CommentItem.tsx
import React, { useState } from 'react';
import { format } from 'date-fns';
import { MessageCircle, Trash2, Edit2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ReactionButton } from '@/features/reaction/components/reaction-button';
import { useDeleteComment } from '../hooks/mutations/delete-comment';
import { useUpdateComment } from '../hooks/mutations/update-comment';

interface Comment {
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
  replies?: Comment[];
  replyCount?: number;
}

interface CommentItemProps {
  comment: Comment;
  postId: string;
  currentUser?: {
    _id: string;
    role?: string;
  };
  onReplyClick?: (commentId: string) => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  postId,
  currentUser,
  onReplyClick
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  
  const updateCommentMutation = useUpdateComment();
  const deleteCommentMutation = useDeleteComment();
  
  const handleSubmitEdit = () => {
    if (editedContent.trim()) {
      updateCommentMutation.mutate({
        commentId: comment._id,
        content: editedContent
      }, {
        onSuccess: () => setIsEditing(false)
      });
    }
  };
  
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      deleteCommentMutation.mutate(comment._id);
    }
  };
  
  const isAuthor = currentUser && currentUser._id === comment.authorId._id;
  const isAdmin = currentUser && currentUser.role === "admin";
  const canModify = isAuthor || isAdmin;
  
  // Format the date
  const formattedDate = format(new Date(comment.createdAt), "PPp");
  
  // Get initials for avatar fallback
  const getInitials = () => {
    return comment.authorId.fullName
      .split(" ")
      .map(name => name[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };
  
  return (
    <div className="pl-4 pr-2 py-3 border-b border-gray-100">
      <div className="flex space-x-3">
        <Avatar>
          {comment.authorId.profilePicture ? (
            <AvatarImage src={comment.authorId.profilePicture.url} alt={comment.authorId.fullName} />
          ) : (
            <AvatarFallback>{getInitials()}</AvatarFallback>
          )}
        </Avatar>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium">{comment.authorId.fullName}</p>
              <p className="text-xs text-gray-500">{formattedDate}</p>
            </div>
            {canModify && (
              <div className="flex space-x-2">
                {isAuthor && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    disabled={isEditing}
                  >
                    <Edit2 size={16} />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  disabled={deleteCommentMutation.isPending}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            )}
          </div>
          
          {isEditing ? (
            <div className="mt-2">
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="min-h-[80px] w-full"
              />
              <div className="flex justify-end space-x-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedContent(comment.content);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmitEdit}
                  disabled={updateCommentMutation.isPending}
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-1 text-sm">{comment.content}</div>
          )}
          
          <div className="flex items-center mt-2 space-x-4">
            <ReactionButton
              contentType="comments"
              contentId={comment._id}
              currentUser={currentUser}
            />
            {currentUser && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReplyClick && onReplyClick(comment._id)}
                className="text-xs"
              >
                <MessageCircle size={16} className="mr-1" /> Reply
              </Button>
            )}
          </div>
          
          {/* Render replies if they exist */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="ml-4 mt-3 space-y-3">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply._id}
                  comment={reply}
                  postId={postId}
                  currentUser={currentUser}
                  onReplyClick={onReplyClick}
                />
              ))}
            </div>
          )}
          
          {/* Show "View more replies" if there are more than what's displayed */}
          {comment.replyCount && comment.replyCount > (comment.replies?.length || 0) && (
            <Button
              variant="link"
              size="sm"
              className="ml-4 mt-1 text-xs"
              onClick={() => onReplyClick && onReplyClick(comment._id)}
            >
              View {comment.replyCount - (comment.replies?.length || 0)} more {comment.replyCount - (comment.replies?.length || 0) === 1 ? 'reply' : 'replies'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};