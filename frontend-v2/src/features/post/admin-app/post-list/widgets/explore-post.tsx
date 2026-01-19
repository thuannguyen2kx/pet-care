import { useCallback, useRef } from 'react';

import { useAdminPostsController } from '@/features/post/admin-app/post-list/application/use-posts';
import { AdminPostItem } from '@/features/post/admin-app/post-list/ui/post-item';
import { SectionSpinner } from '@/shared/components/template/loading';

export function AdminExplorePostWidget() {
  const postsController = useAdminPostsController();

  const observerRef = useRef<IntersectionObserver | null>(null);

  const { fetchNextPage, hasNextPage, isFetchingNextPage } = postsController;

  const loadMoreRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;

      observerRef.current?.disconnect();

      if (!node || !hasNextPage) return;

      observerRef.current = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          fetchNextPage();
        }
      });

      observerRef.current.observe(node);
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  if (postsController.isFetching && postsController.data.length === 0) {
    return <SectionSpinner />;
  }
  if (!postsController.isFetching && postsController.data.length === 0)
    return (
      <div className="py-16 text-center">
        <div className="mb-4">
          <h3 className="text-foreground mb-2 text-lg font-semibold">Chưa có bài viết nào</h3>
          <p className="text-muted-foreground">Hãy quay lại sớm để xem các cập nhật về cửa hàng!</p>
        </div>
      </div>
    );
  const posts = postsController.data;

  return (
    <div className="space-y-8">
      {posts.map((post) => (
        <AdminPostItem key={post.id} post={post} />
      ))}

      <div ref={loadMoreRef} className="py-6">
        {postsController.isFetchingNextPage && <SectionSpinner />}
      </div>
    </div>
  );
}
