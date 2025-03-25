export const isAuthRoute = (pathname: string): boolean => {
  return Object.values(AUTH_ROUTES).includes(pathname);
};
export const AUTH_ROUTES = {
  SIGN_IN: "/sign-in",
  SIGN_UP: "sign-up",
  GOOGLE_OAUTH_CALLBACK: "/google-oauth-callback",
};
export const PROTECTED_ROUTES = {
  CUSTOMER_HOME: "/home",
};
export const BASE_ROUTES = {
  LANDING: "/",
};
