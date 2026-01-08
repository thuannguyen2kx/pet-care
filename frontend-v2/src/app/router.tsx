import { type QueryClient, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';

import { Guards } from '@/features/user/domain/user.guards';
import { default as AppRoot, ErrorBoundary as AppErrorBoundary } from '@/routes/root';
import { MainErrorFallback } from '@/shared/components/errors/main';
import { SplashScreen } from '@/shared/components/template/splash-screen';
import { paths } from '@/shared/config/paths';
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
      // ErrorBoundary: MainErrorFallback,
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
          // ErrorBoundary: AppErrorBoundary,
          children: [
            /* ================= CUSTOMER ================= */
            {
              element: <Authorization guard={Guards.customerArea} />,
              children: [
                {
                  path: paths.customer.root.path,
                  lazy: () => import('@/routes/customer/layout').then(convert(queryClient)),
                  children: [
                    {
                      index: true,
                      lazy: () => import('@/routes/customer/dashboard').then(convert(queryClient)),
                    },
                    {
                      path: paths.customer.pets.path,
                      lazy: () => import('@/routes/customer/pets/index').then(convert(queryClient)),
                    },
                    {
                      path: paths.customer.petNew.path,
                      lazy: () =>
                        import('@/routes/customer/pets/new/index').then(convert(queryClient)),
                    },
                    {
                      path: paths.customer.petDetail.path,
                      lazy: () =>
                        import('@/routes/customer/pets/id/index').then(convert(queryClient)),
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
              element: <Authorization guard={Guards.employeeArea} />,
              children: [
                {
                  path: paths.employee.root.path,
                  children: [
                    {
                      index: true,
                      lazy: () => import('@/routes/employee/dashboard').then(convert(queryClient)),
                    },
                    {
                      path: paths.employee.schedule.path,
                      lazy: () => import('@/routes/employee/schedule').then(convert(queryClient)),
                    },
                    {
                      path: paths.employee.bookings.path,
                      lazy: () => import('@/routes/employee/bookings').then(convert(queryClient)),
                    },
                    {
                      path: paths.employee.profile.path,
                      lazy: () => import('@/routes/employee/profile').then(convert(queryClient)),
                    },
                  ],
                },
              ],
            },
            /* ================= ADMIN ================= */
            {
              element: <Authorization guard={Guards.adminArea} />,
              children: [
                {
                  path: paths.admin.root.path,
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
                      path: paths.admin.employees.path,
                      lazy: () => import('@/routes/admin/employees').then(convert(queryClient)),
                    },
                    {
                      path: paths.admin.schedule.path,
                      lazy: () => import('@/routes/admin/schedule').then(convert(queryClient)),
                    },
                    {
                      path: paths.admin.employeeSchedule.path,
                      lazy: () =>
                        import('@/routes/admin/employee-schedule').then(convert(queryClient)),
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
