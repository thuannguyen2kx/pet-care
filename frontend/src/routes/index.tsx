import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Roles } from "@/constants";
import NotFound from "@/pages/error/not-found";
import AuthLayout from "@/layouts/auth.layout";
import AppLayout from "@/layouts/app.layout";
import BaseLayout from "@/layouts/base.layout";
import AuthRoute from "./auth.route";
import ProtectedRoute from "./protected-route";
import RoleBasedLayout from "./role-based-layout";
import {
  adminRoutesPaths,
  authenticationRoutePaths,
  baseRoutesPaths,
  employeeRoutesPaths,
  managerRoutesPaths,
  protectedCustomerRoutePaths,
} from "./common/routes";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<BaseLayout />}>
          {baseRoutesPaths.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>

        {/* Auth Routes (sign in, sign up, etc.) */}
        <Route path="/" element={<AuthRoute />}>
          <Route element={<AuthLayout />}>
            {authenticationRoutePaths.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Route>
        </Route>

        {/* Customer Routes */}
        <Route path="/" element={<ProtectedRoute roles={[Roles.CUSTOMER]} />}>
          <Route element={<AppLayout />}>
            {protectedCustomerRoutePaths.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Route>
        </Route>

        {/* Staff Routes (Admin and Employee with appropriate layouts) */}
        <Route path="/" element={<ProtectedRoute roles={[Roles.ADMIN, Roles.EMPLOYEE]} />}>
          <Route element={<RoleBasedLayout />}>
            {/* Admin-specific routes */}
            {adminRoutesPaths.map((route) => (
              <Route 
                key={route.path} 
                path={route.path} 
                element={
                  <ProtectedRoute roles={[Roles.ADMIN]}>
                    {route.element}
                  </ProtectedRoute>
                } 
              />
            ))}

            {/* Employee-specific routes */}
            {employeeRoutesPaths.map((route) => (
              <Route 
                key={route.path} 
                path={route.path} 
                element={
                  <ProtectedRoute roles={[Roles.EMPLOYEE]}>
                    {route.element}
                  </ProtectedRoute>
                } 
              />
            ))}

            {/* Shared manager routes (accessible by both admin and employee) */}
            {managerRoutesPaths.map((route) => (
              <Route 
                key={route.path} 
                path={route.path} 
                element={route.element} 
              />
            ))}
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;