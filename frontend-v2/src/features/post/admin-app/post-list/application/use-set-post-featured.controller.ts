import { toast } from 'sonner';

import { useSetPostFeatured } from '@/features/post/api/set-featured';

export const useSetPostFeaturedController = () => {
  const setFeatured = useSetPostFeatured({
    mutationConfig: {
      onSuccess: () => {
        toast.success('Đã đánh dấu bài viết nổi bật');
      },
    },
  });

  const handleSetFeatured = (postId: string, featured: boolean) => {
    setFeatured.mutate({ postId, featured });
  };

  return { onSetFeatured: handleSetFeatured };
};
