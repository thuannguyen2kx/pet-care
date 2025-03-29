import { Navigate, Outlet, useLocation } from "react-router-dom"

import { useGetCurrentUser } from "@/features/user/hooks/queries/use-get-current-user"
import { GlobalLoading } from "@/components/shared/global-loading"
import { Roles } from "@/constants"

import { isAuthRoute, CUSTOMER_ROUTES } from "./common/routePaths"

 const AuthRoute = () => {
  const location = useLocation()

  const {data, isLoading} = useGetCurrentUser()
  const user = data?.user

  const _isAuthRoute = isAuthRoute(location.pathname)
  if(isLoading && !_isAuthRoute) return <GlobalLoading />
  if(!user) return <Outlet />

  const url = user.role === Roles.CUSTOMER ? CUSTOMER_ROUTES.HOME : `/`
  return <Navigate to={url} replace />
}

export default AuthRoute