import SignIn from "@/pages/auth/sign-in";
import { ADMIN_ROUTES, AUTH_ROUTES, BASE_ROUTES, CUSTOMER_ROUTES } from "./routePaths";
import SignUp from "@/pages/auth/sign-up";
import GoogleOauth from "@/pages/auth/google-oauth";
import Landing from "@/pages/base/landing";
import CustomerHome from "@/pages/customer/home";
import Profile from "@/pages/customer/profile";
import PetDetail from "@/pages/customer/pet-details";
import PostDetailsPage from "@/pages/customer/post-details";
import DashboardPage from "@/pages/admin/dashboard";
import AppointementPage from "@/pages/admin/appointment";
import EmployeePage from "@/pages/admin/employee";
import CustomerPage from "@/pages/admin/customer";
import ServicesPage from "@/pages/admin/services";

export const authenticationRoutePaths = [
  { path: AUTH_ROUTES.SIGN_IN, element: <SignIn /> },
  { path: AUTH_ROUTES.SIGN_UP, element: <SignUp /> },
  { path: AUTH_ROUTES.GOOGLE_OAUTH_CALLBACK, element: <GoogleOauth /> },
];
export const protectedCustomerRoutePaths = [
  {
    path: CUSTOMER_ROUTES.HOME,
    element: <CustomerHome />,
  },
  {
    path: CUSTOMER_ROUTES.PROFILE,
    element: <Profile />,
  },

  {
    path: CUSTOMER_ROUTES.PET_DETAILS,
    element: <PetDetail />
  },
  {
    path: CUSTOMER_ROUTES.POST_DETAILS,
    element: <PostDetailsPage />
  }
];

export const adminRoutesPaths = [
  { path: ADMIN_ROUTES.DASHBOARD, element: <DashboardPage /> },
  { path: ADMIN_ROUTES.APPOINTMENT, element: <AppointementPage /> },
  { path: ADMIN_ROUTES.EMPLOYEE, element: <EmployeePage /> },
  { path: ADMIN_ROUTES.CUSTOMER, element: <CustomerPage/> },
  { path: ADMIN_ROUTES.SERVICE, element: <ServicesPage/> },
];

export const baseRoutesPaths = [
  {path: BASE_ROUTES.LANDING, element: <Landing />}
]