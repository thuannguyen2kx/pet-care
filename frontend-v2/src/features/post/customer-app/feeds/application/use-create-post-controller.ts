import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { toast } from 'sonner';

import { useCreatePost } from '@/features/post/api/create-post';
import { CreatePostSchema, type CreatePost } from '@/features/post/domain/post.state';

export const useCreatePostController = () => {
  const [isOpenCreateDialog, setIsOpenCreateDialog] = useState(false);

  const form = useForm<CreatePost>({
    resolver: zodResolver(CreatePostSchema) as Resolver<CreatePost>,
    defaultValues: {
      content: '',
      visibility: 'public',
      media: {
        existing: [],
        added: [],
      },
    },
  });
  const createPost = useCreatePost({
    mutationConfig: {
      onSuccess: () => {
        form.reset();
        toast.success('Đã tạo bài viết');
        setIsOpenCreateDialog(false);
      },
    },
  });

  const submitPost = form.handleSubmit((data) => {
    createPost.mutate(data);
  });

  return {
    state: {
      isOpenCreateDialog,
      isSubmitting: createPost.isPending,
    },
    form,
    actions: {
      openCreateDialog: () => setIsOpenCreateDialog(true),
      closeCreateDialog: () => setIsOpenCreateDialog(false),
      submitPost,
    },
  };
};
