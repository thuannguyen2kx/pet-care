import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type Resolver } from 'react-hook-form';
import { toast } from 'sonner';

import { useAdminCreatePost } from '@/features/post/api/create-post';
import { CreatePostSchema, type CreatePost } from '@/features/post/domain/post.state';

export const useAdminCreatePostController = () => {
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
  const createPost = useAdminCreatePost({
    mutationConfig: {
      onSuccess: () => {
        form.reset();
        toast.success('Đã tạo bài viết');
      },
    },
  });

  const submitPost = form.handleSubmit((data) => {
    createPost.mutate(data);
  });

  return {
    state: {
      isSubmitting: createPost.isPending,
    },
    form,
    actions: {
      submitPost,
    },
  };
};
