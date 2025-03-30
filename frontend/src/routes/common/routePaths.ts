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
  APPOINTMENTS: "/appointments",
  PROFILE: "/profile/:profileId",
  PET_DETAILS: "/pets/:petId",
};
export const ADMIN_ROUTES = {
  DASHBOARD: "/admin/dashboard",
}
export const EMPLOYEE_ROUTES = {
  DASHBOARD: "/employee/dashboard",
}
export const BASE_ROUTES = {
  LANDING: "/",
};
