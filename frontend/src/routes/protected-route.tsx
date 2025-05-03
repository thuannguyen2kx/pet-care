import { Navigate, Outlet } from "react-router-dom";
import { ReactNode } from "react";
import { useGetCurrentUser } from "@/features/user/hooks/queries/use-get-current-user";
import { GlobalLoading } from "@/components/shared/global-loading";
import { RolesType } from "@/constants";

// Two ways to use this component:
// 1. As a wrapper around an Outlet (original behavior)
// 2. As a wrapper around a specific component
const ProtectedRoute = ({ 
  roles, 
  children 
}: { 
  roles: RolesType[], 
  children?: ReactNode 
}) => {
  const { data, isLoading } = useGetCurrentUser();
  const currentUser = data?.user;

  if (isLoading) return <GlobalLoading />;

  const hasAccess = currentUser && roles.includes(currentUser.role);

  // If we're wrapping a specific component
  if (children) {
    return hasAccess ? <>{children}</> : <Navigate to="/" replace />;
  }
  
  // Original behavior - wrapping an Outlet
  return hasAccess ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;