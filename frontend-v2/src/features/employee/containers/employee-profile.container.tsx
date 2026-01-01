import { User } from 'lucide-react';

import { mapProfileToUpdateEmployeeForm } from '@/features/employee/mapper/map-profile-to-update-employee-form';
import { EmployeeProfilePrecenter } from '@/features/employee/precenters/employee-profile.precenter';
import { useGetProfile } from '@/features/user/api/get-profile';
import { EmptyState } from '@/shared/components/template/empty-state';
import { SectionSpinner } from '@/shared/components/template/loading';

export default function EmployeeProfileContainer() {
  const profileQuery = useGetProfile();

  if (profileQuery.isLoading) {
    return <SectionSpinner />;
  }
  if (!profileQuery.data)
    return (
      <EmptyState title="Không tìm thấy thông tin" description="Vui lòng thử lại sau" icon={User} />
    );

  const updateEmployeeFormValues = mapProfileToUpdateEmployeeForm(profileQuery.data);
  return (
    <EmployeeProfilePrecenter
      employee={profileQuery.data}
      updateEmployeeFormValues={updateEmployeeFormValues}
    />
  );
}
