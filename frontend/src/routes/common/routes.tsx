import SignIn from "@/pages/auth/sign-in";
import { AUTH_ROUTES, BASE_ROUTES, CUSTOMER_ROUTES } from "./routePaths";
import SignUp from "@/pages/auth/sign-up";
import GoogleOauth from "@/pages/auth/google-oauth";
import Landing from "@/pages/base/landing";
import CustomerHome from "@/pages/customer/home";

export const authenticationRoutePaths = [
  { path: AUTH_ROUTES.SIGN_IN, element: <SignIn /> },
  { path: AUTH_ROUTES.SIGN_UP, element: <SignUp /> },
  { path: AUTH_ROUTES.GOOGLE_OAUTH_CALLBACK, element: <GoogleOauth /> },
];

export const protectedCustomerRoutePaths = [{
  path: CUSTOMER_ROUTES.HOME, element: <CustomerHome />
}]

export const baseRoutesPaths = [
  {path: BASE_ROUTES.LANDING, element: <Landing />}
]