// src/routes/paths.ts
export const paths = {
  root: {
    path: '/',
    getHref: () => '/',
  },

  /* ===================== AUTH ===================== */
  auth: {
    login: {
      path: '/auth/login',
      getHref: (redirectTo?: string | null) =>
        `/auth/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
    register: {
      path: '/auth/register',
      getHref: (redirectTo?: string | null) =>
        `/auth/register${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
    googleOauth: {
      path: '/google/oauth/callback',
      getHref: (redirectTo?: string | null) =>
        `/google/oauth/callback${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
    forgotPassword: {
      path: '/auth/forgot-password',
      getHref: () => '/auth/forgot-password',
    },
  },

  /* ===================== CUSTOMER ===================== */
  customer: {
    dashboard: {
      path: '/app',
      getHref: () => '/app',
    },
    pets: {
      path: '/app/pets',
      getHref: () => '/app/pets',
    },
    petDetail: {
      path: '/app/pets/:petId',
      getHref: (petId: string) => `/app/pets/${petId}`,
    },
    booking: {
      path: '/app/bookings',
      getHref: () => '/app/bookings',
    },
    bookingDetail: {
      path: '/app/bookings/:bookingId',
      getHref: (bookingId: string) => `/app/bookings/${bookingId}`,
    },
    social: {
      path: '/app/social',
      getHref: () => '/app/social',
    },
    profile: {
      path: '/app/profile',
      getHref: () => '/app/profile',
    },
    settings: {
      path: '/app/settings',
      getHref: () => '/app/settings',
    },
  },

  /* ===================== EMPLOYEE ===================== */
  employee: {
    root: {
      path: '/employee',
      getHref: () => '/employee',
    },
    schedule: {
      path: '/employee/schedule',
      getHref: () => '/employee/schedule',
    },
    bookings: {
      path: '/employee/bookings',
      getHref: () => '/employee/bookings',
    },
    bookingDetail: {
      path: '/employee/bookings/:bookingId',
      getHref: (bookingId: string) => `/employee/bookings/${bookingId}`,
    },
    pets: {
      path: '/employee/pets',
      getHref: () => '/employee/pets',
    },
  },

  /* ===================== ADMIN ===================== */
  admin: {
    root: {
      path: '/admin',
      getHref: () => '/admin',
    },
    dashboard: {
      path: '/admin/dashboard',
      getHref: () => '/admin/dashboard',
    },
    services: {
      path: '/admin/services',
      getHref: () => '/admin/services',
    },
    employees: {
      path: '/admin/employees',
      getHref: () => '/admin/employees',
    },
    analytics: {
      path: '/admin/analytics',
      getHref: () => '/admin/analytics',
    },
    settings: {
      path: '/admin/settings',
      getHref: () => '/admin/settings',
    },
  },

  /* ===================== COMMON ===================== */
  notFound: {
    path: '*',
    getHref: () => '*',
  },
} as const;
