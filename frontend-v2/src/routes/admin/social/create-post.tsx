import type { QueryClient } from '@tanstack/react-query';

import AdminCreatePostPage from '@/features/post/admin-app/create-post/page';
import DashboardLayout from '@/routes/admin/layout';
import { privateClientLoader } from '@/shared/lib/auth.loader';

export const clientLoader = (queryClient: QueryClient) =>
  privateClientLoader(queryClient, () => {});

export default function AdminCreatePostRoute() {
  return (
    <DashboardLayout title="Tạo bài viết" description="Thêm tin tức và ưu đãi mới nhất">
      <AdminCreatePostPage />
    </DashboardLayout>
  );
}
