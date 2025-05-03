import { Navigate, Outlet } from "react-router-dom";
import { useGetCurrentUser } from "@/features/user/hooks/queries/use-get-current-user";
import { GlobalLoading } from "@/components/shared/global-loading";
import { Roles } from "@/constants";
import AdminLayout from "@/layouts/admin.layout";
import EmployeeLayout from "@/layouts/employee.layout";

const RoleBasedLayout = () => {
  const { data, isLoading } = useGetCurrentUser();
  const currentUser = data?.user;

  if (isLoading) return <GlobalLoading />;
  
  if (!currentUser) {
    // This shouldn't happen because of the ProtectedRoute wrapper,
    // but it's good to handle it just in case
    return <Navigate to="/" replace />;
  }

  // Render the appropriate layout based on the user's role
  switch (currentUser.role) {
    case Roles.ADMIN:
      return (
        <AdminLayout>
          <Outlet />
        </AdminLayout>
      );
    case Roles.EMPLOYEE:
      return (
        <EmployeeLayout>
          <Outlet />
        </EmployeeLayout>
      );
    default:
      // Fallback, though this should rarely happen due to the ProtectedRoute
      return <Navigate to="/" replace />;
  }
};

export default RoleBasedLayout;