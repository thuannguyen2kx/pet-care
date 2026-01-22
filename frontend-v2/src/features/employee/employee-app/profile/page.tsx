import { User } from 'lucide-react';

import { useEmployeeProfile } from '@/features/employee/api/get-employee-profile';
import { EmployeeProfileView } from '@/features/employee/employee-app/profile/ui/employee-profile-view';
import { EmptyState } from '@/shared/components/template/empty-state';
import { SectionSpinner } from '@/shared/components/template/loading';

export default function EmployeeProfilePage() {
  const profileQuery = useEmployeeProfile();

  if (profileQuery.isLoading) {
    return <SectionSpinner />;
  }
  if (!profileQuery.data)
    return (
      <EmptyState title="Không tìm thấy thông tin" description="Vui lòng thử lại sau" icon={User} />
    );

  return <EmployeeProfileView employee={profileQuery.data} />;
}
