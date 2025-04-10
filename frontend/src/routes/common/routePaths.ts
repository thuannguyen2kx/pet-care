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
  PROFILE: "/profile/:profileId",
  PET_DETAILS: "/pets/:petId",
  POST_DETAILS: "/posts/:postId",
};
export const ADMIN_ROUTES = {
  EMPLOYEE: "/admin/employees",
  EMPLOYEE_NEW: "/admin/employees/new",
  EMPLOYEE_DETAILS: "/admin/employees/:employeeId",
  EMPLOYEE_EDIT: "/admin/employees/:employeeId/edit",
  EMPLOYEE_SCHEDULE: "/admin/employees/:employeeId/schedule",
  DASHBOARD: "/admin/dashboard",
  CUSTOMER: "/admin/customers",
  SERVICE: "/admin/services",
  SERVICE_CREATION: "/admin/services/create",
  SERVICE_EDIT: "/admin/services/edit/:serviceId",
  APPOINTMENT: "/admin/appointments",
};
export const EMPLOYEE_ROUTES = {
  DASHBOARD: "/employee/dashboard",
};
export const BASE_ROUTES = {
  LANDING: "/",
};
