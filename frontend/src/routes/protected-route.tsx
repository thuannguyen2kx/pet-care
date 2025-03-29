import { Navigate, Outlet } from "react-router-dom";

import { useGetCurrentUser } from "@/features/user/hooks/queries/use-get-current-user";
import { GlobalLoading } from "@/components/shared/global-loading";
import { RolesType } from "@/constants";

const ProtectedRoute = ({ role }: { role: RolesType }) => {
  const { data, isLoading } = useGetCurrentUser();
  const currentUser = data?.user;

  if (isLoading) return <GlobalLoading />;

  const hasAccess = currentUser && currentUser.role === role;

  return hasAccess ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
