import { type QueryClient, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';

import { default as AppRoot, ErrorBoundary as AppErrorBoundary } from '@/routes/root';
import { MainErrorFallback } from '@/shared/components/errors/main';
import { SplashScreen } from '@/shared/components/template/splash-screen';
import { paths } from '@/shared/config/paths';
import { ROLES } from '@/shared/constant/roles';
import { ProtectedRoute } from '@/shared/lib/auth';
import { Authorization } from '@/shared/lib/authorization';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const convert = (queryClient: QueryClient) => (m: any) => {
  const { clientLoader, clientAction, default: Component, ...rest } = m;
  return {
    ...rest,
    loader: clientLoader?.(queryClient),
    action: clientAction?.(queryClient),
    Component,
  };
};

const createAppRouter = (queryClient: QueryClient) => {
  return createBrowserRouter([
    {
      id: 'root',
      hydrateFallbackElement: <SplashScreen />,
      ErrorBoundary: MainErrorFallback,
      children: [
        {
          path: paths.root.path,
          lazy: () => import('@/routes/landing').then(convert(queryClient)),
        },

        /* ================= AUTH ================= */
        {
          path: paths.auth.login.path,
          lazy: () => import('@/routes/auth/login').then(convert(queryClient)),
        },
        {
          path: paths.auth.register.path,
          lazy: () => import('@/routes/auth/register').then(convert(queryClient)),
        },
        {
          path: paths.auth.googleOauth.path,
          lazy: () => import('@/routes/auth/google-oauth').then(convert(queryClient)),
        },
        {
          path: '',
          element: <AppRoot />,
          ErrorBoundary: AppErrorBoundary,
          children: [
            /* ================= CUSTOMER ================= */
            {
              element: <Authorization allowedRoles={[ROLES.CUSTOMER]} />,
              children: [
                {
                  path: paths.customer.dashboard.path,
                  lazy: () => import('@/routes/customer/layout').then(convert(queryClient)),
                  children: [
                    {
                      index: true,
                      lazy: () => import('@/routes/customer/dashboard').then(convert(queryClient)),
                    },
                    {
                      path: paths.customer.pets.path,
                      lazy: () =>
                        import('@/features/pets/pages/customer-pets-list.page').then(
                          convert(queryClient),
                        ),
                    },
                    {
                      path: paths.customer.petNew.path,
                      lazy: () =>
                        import('@/features/pets/pages/customer-pet-new.page').then(
                          convert(queryClient),
                        ),
                    },
                    {
                      path: paths.customer.petDetail.path,
                      lazy: () =>
                        import('@/features/pets/pages/customer-pet-detail.page').then(
                          convert(queryClient),
                        ),
                    },
                    {
                      path: paths.customer.booking.path,
                      lazy: () => import('@/routes/customer/bookings').then(convert(queryClient)),
                    },
                    {
                      path: paths.customer.social.path,
                      lazy: () => import('@/routes/customer/social').then(convert(queryClient)),
                    },
                  ],
                },
              ],
            },
            /* ================= EMPLOYEE ================= */
            {
              element: <Authorization allowedRoles={[ROLES.EMPLOYEE]} />,
              children: [
                {
                  path: paths.employee.root.path,
                  lazy: () => import('@/routes/employee/layout').then(convert(queryClient)),
                  children: [
                    {
                      index: true,
                      lazy: () => import('@/routes/employee/schedule').then(convert(queryClient)),
                    },
                    {
                      path: 'bookings',
                      lazy: () => import('@/routes/employee/bookings').then(convert(queryClient)),
                    },
                  ],
                },
              ],
            },
            /* ================= ADMIN ================= */
            {
              element: <Authorization allowedRoles={[ROLES.ADMIN]} />,
              children: [
                {
                  path: paths.admin.root.path,
                  lazy: () => import('@/routes/admin/layout').then(convert(queryClient)),
                  children: [
                    {
                      index: true,
                      lazy: () => import('@/routes/admin/dashboard').then(convert(queryClient)),
                    },
                    {
                      path: 'services',
                      lazy: () => import('@/routes/admin/services').then(convert(queryClient)),
                    },
                    {
                      path: 'employees',
                      lazy: () => import('@/routes/admin/employees').then(convert(queryClient)),
                    },
                  ],
                },
              ],
            },
          ],
        },

        /* ================= NOT FOUND ================= */
        {
          path: paths.notFound.path,
          lazy: () => import('@/routes/not-found').then(convert(queryClient)),
        },
      ],
    },
  ]);
};
export const AppRouter = () => {
  const queryClient = useQueryClient();
  const router = useMemo(() => createAppRouter(queryClient), [queryClient]);

  return <RouterProvider router={router} />;
};
