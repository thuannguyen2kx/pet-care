import type { QueryClient } from '@tanstack/react-query';
import type { ClientLoaderFunctionArgs } from 'react-router';

import AdminCustomerPage from '@/features/customer/admin-app/customer-list/page';
import { getCustomersQueryOptions } from '@/features/customer/api/get-customers';
import { CustomersQuerySchema } from '@/features/customer/domain/customer-state';
import { getReportCustomersQueryOptions } from '@/features/report/api/get-report-customer';
import { ReportCustomersQuerySchema } from '@/features/report/domain/report-state';
import DashboardLayout from '@/routes/admin/layout';
import { privateClientLoader } from '@/shared/lib/auth.loader';

export const clientLoader = (queryClient: QueryClient) => {
  return privateClientLoader(queryClient, async ({ request }: ClientLoaderFunctionArgs) => {
    const url = new URL(request.url);
    const reportParsed = ReportCustomersQuerySchema.safeParse(Object.fromEntries(url.searchParams));
    if (!reportParsed.success) {
      throw new Response('Invalid query params', { status: 400 });
    }
    const queryParams = reportParsed.data;
    const reportCustomersOptions = getReportCustomersQueryOptions(queryParams);

    const customersQueryParsed = CustomersQuerySchema.safeParse(
      Object.fromEntries(url.searchParams),
    );
    if (!customersQueryParsed.success) {
      throw new Response('Invalid query params', { status: 400 });
    }
    const customersQueryParams = customersQueryParsed.data;

    const customersOptions = getCustomersQueryOptions(customersQueryParams);
    await Promise.all([
      queryClient.ensureQueryData(reportCustomersOptions),
      queryClient.ensureQueryData(customersOptions),
    ]);

    return null;
  });
};
export default function AdminCustomersRoute() {
  return (
    <DashboardLayout title="Quản lý khách hàng" description="Xem và quả lý thông tin khách hàng">
      <AdminCustomerPage />
    </DashboardLayout>
  );
}
