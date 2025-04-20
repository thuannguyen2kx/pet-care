import { BrowserRouter, Route, Routes } from "react-router-dom";

import NotFound from "@/pages/error/not-found";
import AuthLayout from "@/layouts/auth.layout";
import AppLayout from "@/layouts/app.layout";
import BaseLayout from "@/layouts/base.layout";
import AdminLayout from "@/layouts/admin.layout";

import { Roles } from "@/constants";
import {
  adminRoutesPaths,
  authenticationRoutePaths,
  baseRoutesPaths,
  employeeRoutesPaths,
  protectedCustomerRoutePaths,
} from "./common/routes";
import AuthRoute from "./auth.route";
import ProtectedRoute from "./protected-route";
import EmployeeLayout from "@/layouts/employee.layout";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<BaseLayout />}>
          {baseRoutesPaths.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>

        <Route path="/" element={<AuthRoute />}>
          <Route element={<AuthLayout />}>
            {authenticationRoutePaths.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Route>
        </Route>

        <Route path="/" element={<ProtectedRoute role={Roles.CUSTOMER} />}>
          <Route element={<AppLayout />}>
            {protectedCustomerRoutePaths.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Route>
        </Route>

        <Route path="/" element={<ProtectedRoute role={Roles.ADMIN} />}>
          <Route element={<AdminLayout />}>
            {adminRoutesPaths.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Route>
        </Route>

        <Route path="/" element={<ProtectedRoute role={Roles.EMPLOYEE} />}>
          <Route element={<EmployeeLayout />}>
            {employeeRoutesPaths.map((route) => (
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
