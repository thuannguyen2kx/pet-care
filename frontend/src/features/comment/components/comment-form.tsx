import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAddComment } from '../hooks/mutations/add-comment';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthContext } from '@/context/auth-provider';

interface CommentFormProps {
  postId: string;
  parentCommentId?: string;
  onSuccess?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  compact?: boolean; // For a more compact version in replies
}

export const CommentForm: React.FC<CommentFormProps> = ({
  postId,
  parentCommentId,
  onSuccess,
  placeholder = 'Viết bình luận...',
  autoFocus = false,
  compact = false
}) => {
  const [content, setContent] = useState('');
  const addCommentMutation = useAddComment();
  const { user } = useAuthContext();
  
  if (!user) return null;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (content.trim()) {
      addCommentMutation.mutate(
        { 
          postId, 
          content, 
          parentCommentId 
        },
        {
          onSuccess: () => {
            setContent('');
            if (onSuccess) onSuccess();
          }, 
        }
      );
    }
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    return user.fullName
      ?.split(" ")
      .map(name => name[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "U";
  };
  
  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="mt-2 mb-3">
        <div className="flex items-center">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            className="flex-1 min-h-[36px] py-2 resize-none text-sm comment-form-input"
            autoFocus={autoFocus}
          />
          <Button
            type="submit"
            size="sm"
            variant="ghost"
            className="ml-2 p-2"
            disabled={!content.trim() || addCommentMutation.isPending}
          >
            <Send size={16} className="text-primary" />
          </Button>
        </div>
        {addCommentMutation.isPending && (
          <p className="text-xs text-gray-500 mt-1">Đang gửi bình luận...</p>
        )}
      </form>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="mt-2 mb-4">
      <div className="flex items-start">
        <Avatar className="h-8 w-8 mt-2 mr-2">
          <AvatarImage src={user.profilePicture?.url || ''} />
          <AvatarFallback className="bg-primary text-white text-xs">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            className="w-full min-h-[60px] resize-none comment-form-input"
            autoFocus={autoFocus}
          />
          <div className="flex justify-end mt-2">
            <Button
              type="submit"
              size="sm"
              disabled={!content.trim() || addCommentMutation.isPending}
            >
              {addCommentMutation.isPending ? 'Đang gửi...' : 'Bình luận'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};