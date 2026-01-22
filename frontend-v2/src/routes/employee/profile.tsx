import type { QueryClient } from '@tanstack/react-query';

import { getProfleQueryOptions } from '@/features/employee/api/get-employee-profile';
import EmployeeProfilePage from '@/features/employee/employee-app/profile/page';
import EmployeeLayout from '@/routes/employee/layout';
import { privateClientLoader } from '@/shared/lib/auth.loader';

export const clientLoader = (queryClient: QueryClient) => {
  return privateClientLoader(queryClient, async () => {
    const query = getProfleQueryOptions();

    return queryClient.getQueryData(query.queryKey) ?? queryClient.fetchQuery(query);
  });
};

export default function EmployeeProfileRoute() {
  return (
    <EmployeeLayout
      title="Thông tin cá nhân"
      description="Cập nhật thông tin và chuyên môn của bạn"
    >
      <EmployeeProfilePage />
    </EmployeeLayout>
  );
}
