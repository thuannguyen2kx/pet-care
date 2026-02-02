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
    suspended: {
      path: '/auth/suspended',
      getHref: () => '/auth/suspended',
    },
  },

  /* ===================== CUSTOMER ===================== */
  customer: {
    root: {
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
    petNew: {
      path: '/app/pets/new',
      getHref: () => '/app/pets/new',
    },
    booking: {
      path: '/app/bookings',
      getHref: () => '/app/bookings',
    },
    createBooking: {
      path: '/app/bookings/create',
      getHref: (serviceId: string) => `/app/bookings/create?serviceId=${serviceId}`,
    },
    successBooking: {
      path: '/app/bookings/create/success',
      getHref: () => '/app/bookings/create/success',
    },
    myBookings: {
      path: '/app/bookings/me',
      getHref: () => '/app/bookings/me',
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
    payment: {
      path: '/app/payment/booking/:bookingId',
      getHref: (bookingId: string) => `/app/payment/booking/${bookingId}`,
    },
    paymentSuccess: {
      path: '/app/payments/success',
      getHref: () => `/app/payment/success`,
    },
    paymentCancel: {
      path: '/app/payments/cancel',
      getHref: () => `/app/payment/cancel`,
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
    profile: {
      path: '/employee/profile',
      getHref: () => '/employee/profile',
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
    employeeSchedule: {
      path: '/admin/employees/:employeeId/schedule',
      getHref: (employeeId: string) => `/admin/employees/${employeeId}/schedule`,
    },
    customer: {
      path: '/admin/customer',
      getHref: () => '/admin/customer',
    },
    bookings: {
      path: '/admin/bookings',
      getHref: () => '/admin/bookings',
    },
    bookingDetail: {
      path: '/admin/bookings/:bookingId',
      getHref: (bookingId: string) => `/admin/bookings/${bookingId}`,
    },
    schedule: {
      path: '/admin/schedule',
      getHref: () => '/admin/schedule',
    },
    reports: {
      path: '/admin/reports',
      getHref: () => '/admin/reports',
    },
    settings: {
      path: '/admin/settings',
      getHref: () => '/admin/settings',
    },
    socials: {
      path: '/admin/socials',
      getHref: () => '/admin/socials',
    },
    createPost: {
      path: '/admin/socials/create',
      getHref: () => '/admin/socials/create',
    },
  },

  /* ===================== COMMON ===================== */
  notFound: {
    path: '*',
    getHref: () => '*',
  },
} as const;
