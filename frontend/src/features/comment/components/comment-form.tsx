// components/comments/CommentForm.tsx
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAddComment } from '../hooks/mutations/add-comment';

interface CommentFormProps {
  postId: string;
  parentCommentId?: string;
  onSuccess?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export const CommentForm: React.FC<CommentFormProps> = ({
  postId,
  parentCommentId,
  onSuccess,
  placeholder = 'Write a comment...',
  autoFocus = false
}) => {
  const [content, setContent] = useState('');
  const addCommentMutation = useAddComment();
  
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
          }
        }
      );
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="mt-2 mb-4">
      <div className="flex">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className="flex-1 min-h-[40px] resize-none"
          autoFocus={autoFocus}
        />
        <Button
          type="submit"
          size="sm"
          className="ml-2 self-end"
          disabled={!content.trim() || addCommentMutation.isPending}
        >
          <Send size={16} />
        </Button>
      </div>
      {addCommentMutation.isPending && (
        <p className="text-xs text-gray-500 mt-1">Posting your comment...</p>
      )}
    </form>
  );
};