import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { postKeys } from '@/features/post/query-key';
import { PostType } from '@/features/post/types/api.types';
import { useAuthContext } from '@/context/auth-provider';
import { Roles } from '@/constants';
import { addCommentMutationFn } from '@/features/comment/api';


// Hook for handling comments
export const usePostComments = (postId: string) => {
  const [newComment, setNewComment] = useState('');
  const queryClient = useQueryClient();
  
  const commentMutation = useMutation({
    mutationFn: (newComment: string) => addCommentMutationFn({ postId, content: newComment }), 
    onSuccess: () => {
      setNewComment('');
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
      toast.success("Bình luận đã được đăng");
    },
    onError: () => {
      toast.error("Không thể đăng bình luận, vui lòng thử lại");
    }
  });

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    commentMutation.mutate(newComment);
  };

  return {
    newComment,
    setNewComment,
    isSubmitting: commentMutation.isPending,
    handleSubmitComment
  };
};

// Helper function to check if current user has permissions for a post
export const usePostPermissions = (post: PostType | null) => {
  const { user } = useAuthContext();
  
  const isAuthor = !!user && !!post && post.authorId._id === user._id;
  const isAdmin = !!user && user.role === Roles.ADMIN;
  const canModify = isAuthor || isAdmin;
  
  return { isAuthor, isAdmin, canModify };
};