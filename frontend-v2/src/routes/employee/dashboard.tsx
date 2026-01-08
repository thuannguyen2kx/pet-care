import EmployeeLayout from '@/routes/employee/layout';
import { useUser } from '@/shared/lib/auth';

export default function EmployeeDashboardRoute() {
  const user = useUser();

  return (
    <EmployeeLayout
      title={`Xin chào, ${user.data?.profile.displayName}`}
      description="Tổng quan hoạt động của bạn"
    >
      <div>Dashboard</div>
    </EmployeeLayout>
  );
}
