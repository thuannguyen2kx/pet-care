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
  DASHBOARD: "/admin/dashboard",
  CUSTOMER: "/admin/customers",
  CUSTOMER_DETAILS: "/admin/customers/:customerId",
  SERVICE: "/admin/services",
  SERVICE_CREATION: "/admin/services/create",
  SERVICE_EDIT: "/admin/services/edit/:serviceId",
  APPOINTMENT: "/admin/appointments",
  APPOINTMENT_CALENDAR: "/admin/appointments/calendar",
  APPOINTMENT_DETAILS: "/admin/appointments/:appointmentId",
  PAYMENT: "/admin/payments",
};
export const EMPLOYEE_ROUTES = {
  HOME: "/employee/home",
  APPOINTMENTS: "/employee/appointments",
  POST: "/employee/posts",
  POST_DETAILS: "/employee/posts/:postId",
};
export const BASE_ROUTES = {
  LANDING: "/",
};
