import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { MessageCircle, Trash2, Edit2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ReactionButton } from "@/features/reaction/components/reaction-button";
import { useDeleteComment } from "../hooks/mutations/delete-comment";
import { useUpdateComment } from "../hooks/mutations/update-comment";
import { Link } from "react-router-dom";
import { CommentForm } from "./comment-form";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";

interface Comment {
  _id: string;
  postId: string;
  authorId: {
    _id: string;
    fullName: string;
    profilePicture?: {
      url: string;
      publicId?: string;
    };
  };
  content: string;
  parentCommentId?: string;
  status: "active" | "blocked" | "deleted";
  createdAt: string | Date;
  updatedAt: string | Date;
  replies?: Comment[];
  replyCount?: number;
  stats?: {
    likeCount: number;
    replyCount: number;
  };
}

interface CommentItemProps {
  comment: Comment;
  postId: string;
  currentUser?: {
    _id: string;
    role?: string;
  } | null;
  onReplyClick?: (commentId: string) => void;
  level?: number; // For nesting level
  showReplyForm?: boolean;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  postId,
  currentUser,
  onReplyClick,
  level = 0,
  showReplyForm = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [showingReplyForm, setShowingReplyForm] = useState(showReplyForm);

  const updateCommentMutation = useUpdateComment();
  const deleteCommentMutation = useDeleteComment();
  const [DeleteDialog, confirmDelete] = useConfirm(
    "Xoá bình luận",
    "Bạn có chắc chắn muốn xoá bình luận này không?"
  );
  const handleSubmitEdit = () => {
    if (editedContent.trim()) {
      updateCommentMutation.mutate(
        {
          commentId: comment._id,
          content: editedContent,
        },
        {
          onSuccess: () => {
            setIsEditing(false);
            toast.success("Bình luận đã được cập nhật");
          },
          onError: () => {
            toast.error("Không thể cập nhật bình luận");
          },
        }
      );
    }
  };

  const handleDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) return;
    deleteCommentMutation.mutate(comment._id, {
      onSuccess: () => {
        toast.success("Đã xóa bình luận");
      },
      onError: () => {
        toast.error("Không thể xóa bình luận");
      },
    });
  };

  const handleReplyClick = () => {
    setShowingReplyForm(!showingReplyForm);

    if (onReplyClick) {
      onReplyClick(comment._id);
    }
  };

  const isAuthor = currentUser && currentUser._id === comment.authorId._id;
  const isAdmin = currentUser && currentUser.role === "admin";
  const canModify = isAuthor || isAdmin;
  const remainingReplies =
    (comment.replyCount || 0) - (comment.replies?.length || 0);
  // Format the date
  const timeAgo =
    typeof comment.createdAt === "string"
      ? formatDistanceToNow(new Date(comment.createdAt), {
          addSuffix: true,
          locale: vi,
        })
      : formatDistanceToNow(comment.createdAt, { addSuffix: true, locale: vi });

  // Get initials for avatar fallback
  const getInitials = () => {
    return (
      comment.authorId.fullName
        ?.split(" ")
        .map((name) => name[0])
        .join("")
        .substring(0, 2)
        .toUpperCase() || "U"
    );
  };

  // Maximum nesting level
  const maxLevel = 3;

  return (
    <>
      <DeleteDialog />
      <div
        className={`${
          level > 0 ? "ml-6 pl-3 border-l border-gray-100" : ""
        } py-3`}
      >
        <div className="flex space-x-3">
          <Link
            to={`/profile/${comment.authorId._id}`}
            className="flex-shrink-0"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={comment.authorId.profilePicture?.url}
                alt={comment.authorId.fullName}
              />
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <Link
                  to={`/profile/${comment.authorId._id}`}
                  className="text-sm font-medium hover:underline"
                >
                  {comment.authorId.fullName}
                </Link>
                <p className="text-xs text-gray-500">{timeAgo}</p>
              </div>
              {canModify && (
                <div className="flex space-x-2">
                  {isAuthor && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      disabled={isEditing}
                      className="h-6 w-6 p-0"
                    >
                      <Edit2 size={14} className="text-gray-500" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    disabled={deleteCommentMutation.isPending}
                    className="h-6 w-6 p-0"
                  >
                    <Trash2 size={14} className="text-red-500" />
                  </Button>
                </div>
              )}
            </div>

            {isEditing ? (
              <div className="mt-2">
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="min-h-[60px] w-full text-sm"
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
                    Hủy
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSubmitEdit}
                    disabled={
                      updateCommentMutation.isPending || !editedContent.trim()
                    }
                  >
                    {updateCommentMutation.isPending ? "Đang lưu..." : "Lưu"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-1 text-sm">{comment.content}</div>
            )}

            <div className="flex items-center mt-2 space-x-4">
              <ReactionButton
                contentType="comment"
                contentId={comment._id}
                currentUser={currentUser ? { _id: currentUser._id } : undefined}
                variant="minimal"
              />
              {currentUser && level < maxLevel && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReplyClick}
                  className="text-xs px-2 h-6"
                >
                  <MessageCircle size={14} className="mr-1" /> Phản hồi
                </Button>
              )}
            </div>

            {/* Reply form */}
            {showingReplyForm && currentUser && level < maxLevel && (
              <div className="mt-2">
                <CommentForm
                  postId={postId}
                  parentCommentId={comment._id}
                  placeholder="Viết phản hồi..."
                  autoFocus={true}
                  compact={true}
                  onSuccess={() => setShowingReplyForm(false)}
                />
              </div>
            )}

            {/* Render replies if they exist */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-3 space-y-3">
                {comment.replies.map((reply) => (
                  <CommentItem
                    key={reply._id}
                    comment={reply}
                    postId={postId}
                    currentUser={currentUser}
                    onReplyClick={onReplyClick}
                    level={level + 1}
                  />
                ))}
              </div>
            )}

            {/* Show "View more replies" if there are more than what's displayed */}

            {remainingReplies > 0 && (
              <Button
                variant="link"
                size="sm"
                className="mt-1 text-xs px-0"
                onClick={() => onReplyClick?.(comment._id)}
              >
                Xem thêm {remainingReplies} phản hồi
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
