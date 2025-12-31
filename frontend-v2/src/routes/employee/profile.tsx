import EmployeeLayout from '@/routes/employee/layout';

export default function EmployeeProfileRoute() {
  return (
    <EmployeeLayout
      title="Thông tin cá nhân"
      description="Cập nhật thông tin và chuyên môn của bạn"
    >
      <div>Profile</div>
    </EmployeeLayout>
  );
}
