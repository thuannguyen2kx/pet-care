import type { QueryClient } from '@tanstack/react-query';
import type { ClientLoaderFunctionArgs } from 'react-router';

import AdminReportOverviewPage from '@/features/report/admin-app/report-overview/page';
import { getReportOverviewQueryOptions } from '@/features/report/api/get-report-overview';
import { ReportOverviewQuerySchema } from '@/features/report/domain/report-state';
import DashboardLayout from '@/routes/admin/layout';
import { privateClientLoader } from '@/shared/lib/auth.loader';

export const clientLoader = (queryClient: QueryClient) => {
  return privateClientLoader(queryClient, async ({ request }: ClientLoaderFunctionArgs) => {
    const url = new URL(request.url);
    const parsed = ReportOverviewQuerySchema.safeParse(Object.fromEntries(url.searchParams));
    if (!parsed.success) {
      throw new Response('Invalid query params', { status: 400 });
    }
    const queryParams = parsed.data;
    const reportOverviewOptions = getReportOverviewQueryOptions(queryParams);

    await Promise.all([queryClient.ensureQueryData(reportOverviewOptions)]);

    return null;
  });
};
export default function AdminReportRoute() {
  return (
    <DashboardLayout title="Báo cáo & thống kê" description="Phân tích hoạt động kinh doanh">
      <AdminReportOverviewPage />
    </DashboardLayout>
  );
}
