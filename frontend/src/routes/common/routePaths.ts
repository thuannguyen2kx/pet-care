export const isAuthRoute = (pathname: string): boolean => {
  return Object.values(AUTH_ROUTES).includes(pathname);
};
export const AUTH_ROUTES = {
  SIGN_IN: "/sign-in",
  SIGN_UP: "sign-up",
  GOOGLE_OAUTH_CALLBACK: "/google/oauth/callback",
};
export const CUSTOMER_ROUTES = {
  HOME: "/home",
  CREATE_POST: "/create-post",
  SERVICES: "/services",
  SERVICES_DETAILS: "/services/:serviceId",
  APPOINTMENTS: "/appointments",
  APPOINTMENTS_CREATION: "/appointments/new",
  APPOINTMENTS_DETAILS: "/appointments/:appointmentId",
  PROFILE: "/profile/:profileId",
  PET_DETAILS: "/pets/:petId",
  POST_DETAILS: "/posts/:postId",
  PAYMENT_SUCCESS: "/payments/success",
  PAYMENT_CANCEL: "/payments/cancel",
};
export const ADMIN_ROUTES = {
  EMPLOYEE: "/admin/employees",
  EMPLOYEE_NEW: "/admin/employees/new",
  EMPLOYEE_DETAILS: "/admin/employees/:employeeId",
  EMPLOYEE_EDIT: "/admin/employees/:employeeId/edit",
  EMPLOYEE_SCHEDULE: "/admin/employees/:employeeId/schedule",
  EMPLOYEE_DETAILS_MANAGEMENT: "/admin/employees/:id/management",
  DASHBOARD: "/admin/dashboard",
  APPOINTMENT: "/admin/appointments",
  APPOINTMENT_CALENDAR: "/admin/appointments/calendar",
  PAYMENT: "/admin/payments",
};
export const EMPLOYEE_ROUTES = {
  HOME: "/employee/home",
  PROFILE: "/employee/profile",
  REPORT: "/employee/report",
  SCHEDULE: "/employee/schedule",
};

export const MANAGER_ROUTES = {
  CUSTOMER: "/manager/customers",
  CUSTOMER_DETAILS: "/manager/customers/:customerId",
  APPOINTMENTS_DETAILS: "/manager/appointments/:appointmentId",

  POST: "/manager/posts",
  POST_DETAILS: "/manager/posts/:postId",

  SERVICES: "/manager/services",
  SERVICE_CREATION: "/manager/services/create",
  SERVICE_EDIT: "/manager/services/edit/:serviceId",

  PET_DETAILS: "/manager/pets/:petId",
};
export const BASE_ROUTES = {
  LANDING: "/",
};
