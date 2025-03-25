import { BrowserRouter, Route, Routes } from "react-router-dom";

import NotFound from "@/pages/error/not-found";
import AuthLayout from "@/layouts/auth.layout";
import AppLayout from "@/layouts/app.layout";
import BaseLayout from "@/layouts/base.layout";

import {
  authenticationRoutePaths,
  baseRoutesPaths,
  protectedRoutePaths,
} from "./common/routes";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<BaseLayout />}>
          {baseRoutesPaths.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>

        <Route element={<AuthLayout />}>
          {authenticationRoutePaths.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>

        <Route element={<AppLayout />}>
          {protectedRoutePaths.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
