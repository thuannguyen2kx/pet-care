import type { QueryClient } from '@tanstack/react-query';

import AdminPostListPage from '@/features/post/admin-app/post-list/page';
import { getAdminPostsInfiniteQueryOptions } from '@/features/post/api/get-posts';
import { AdminPostsQuerySchema } from '@/features/post/domain/post.state';
import DashboardLayout from '@/routes/admin/layout';
import { privateClientLoader } from '@/shared/lib/auth.loader';

export const clientLoader = (queryClient: QueryClient) =>
  privateClientLoader(queryClient, () => {
    const postsQuery = getAdminPostsInfiniteQueryOptions(AdminPostsQuerySchema.parse({}));

    return (
      queryClient.getQueryData(postsQuery.queryKey) ?? queryClient.prefetchInfiniteQuery(postsQuery)
    );
  });

export default function AdminPostListRoute() {
  return (
    <DashboardLayout
      title="Cộng đồng"
      description="Chia sẻ tin tức, cập nhật và thông báo với khách hàng của bạn."
    >
      <AdminPostListPage />
    </DashboardLayout>
  );
}
