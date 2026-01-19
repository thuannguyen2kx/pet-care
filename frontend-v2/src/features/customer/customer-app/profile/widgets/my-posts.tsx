import { useCallback, useRef } from 'react';

import { useCustomerMyPostsController } from '@/features/customer/customer-app/profile/application/use-my-posts';
import { MyPostItem } from '@/features/customer/customer-app/profile/ui/my-post-item';
import { SectionSpinner } from '@/shared/components/template/loading';
import { Card, CardContent } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

export function MyPostsWidget() {
  const postsController = useCustomerMyPostsController();

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
    return <MyPostsSkeleton />;
  }
  if (!postsController.isFetching && postsController.data.length === 0)
    return (
      <div className="py-16 text-center">
        <div className="mb-4">
          <h3 className="text-foreground mb-2 text-lg font-semibold">Bạn chưa có bài viết nào</h3>
          <p className="text-muted-foreground">Hãy chia sẽ khoảnh khắc với thú cưng của bạn!</p>
        </div>
      </div>
    );
  const posts = postsController.data;

  return (
    <div className="space-y-8">
      {posts.map((post) => (
        <MyPostItem key={post.id} post={post} />
      ))}

      <div ref={loadMoreRef} className="py-6">
        {postsController.isFetchingNextPage && <SectionSpinner />}
      </div>
    </div>
  );
}

function MyPostsSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="rounded-none border-none p-4 shadow-none">
          <CardContent className="p-5">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <div className="border-muted-foreground flex items-center gap-4 border-t pt-3">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
