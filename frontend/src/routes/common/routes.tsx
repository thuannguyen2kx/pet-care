import SignIn from "@/pages/auth/sign-in";
import {
  ADMIN_ROUTES,
  AUTH_ROUTES,
  BASE_ROUTES,
  CUSTOMER_ROUTES,
} from "./routePaths";
import SignUp from "@/pages/auth/sign-up";
import GoogleOauth from "@/pages/auth/google-oauth";
import Landing from "@/pages/base/landing";
import CustomerHome from "@/pages/customer/home";
import Profile from "@/pages/customer/profile";
import PetDetail from "@/pages/customer/pet-details";
import PostDetailsPage from "@/pages/customer/post-details";
import DashboardPage from "@/pages/admin/dashboard";
import AppointementPage from "@/pages/admin/appointment";
import CustomerPage from "@/pages/admin/customer";
import ServicesPage from "@/pages/admin/services";
import ServiceDetailsPage from "@/pages/customer/service-details";
import ServiceCreationPage from "@/pages/admin/service-creation";
import ServiceEditionPage from "@/pages/admin/service-edition";
import ServiceCatalogPage from "@/pages/customer/service-catalog";
import EmployeeDetailsPage from "@/pages/admin/employee-details";
import EmployeeCreationPage from "@/pages/admin/employee-new";
import EmployeesPage from "@/pages/admin/employee";
import EmployeeCalendarPage from "@/pages/admin/employee-calendar";
import EmployeeEditionPage from "@/pages/admin/employee-edition";
import AppointmentCreationPage from "@/pages/customer/appointment-creation";
import AppointmentDetailPage from "@/pages/customer/appointment-details";
import AppointmentListPage from "@/pages/customer/appointment-list";
import AppointmentCalendarPage from "@/pages/admin/appointment-calendar";
import AdminAppointmentDetailsPage from "@/pages/admin/appointment-details";
import PaymentSuccessPage from "@/pages/customer/payment-success";
import PaymentCancelPage from "@/pages/customer/payment-cancel";
import AdminPaymentManagement from "@/pages/admin/payment-management";

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
    element: <PetDetail />,
  },
  {
    path: CUSTOMER_ROUTES.POST_DETAILS,
    element: <PostDetailsPage />,
  },
  {
    path: CUSTOMER_ROUTES.SERVICES,
    element: <ServiceCatalogPage />,
  },
  {
    path: CUSTOMER_ROUTES.SERVICES_DETAILS,
    element: <ServiceDetailsPage />,
  },
  {
    path: CUSTOMER_ROUTES.APPOINTMENTS,
    element: <AppointmentListPage />
  },
  {
    path: CUSTOMER_ROUTES.APPOINTMENTS_CREATION,
    element: <AppointmentCreationPage />
  },
  {
    path: CUSTOMER_ROUTES.APPOINTMENTS_DETAILS,
    element: <AppointmentDetailPage />
  },
  {
    path: CUSTOMER_ROUTES.PAYMENT_SUCCESS,
    element: <PaymentSuccessPage />
  },
  {
    path: CUSTOMER_ROUTES.PAYMENT_CANCEL,
    element: <PaymentCancelPage />
  }
];

export const adminRoutesPaths = [
  { path: ADMIN_ROUTES.DASHBOARD, element: <DashboardPage /> },
  { path: ADMIN_ROUTES.APPOINTMENT, element: <AppointementPage /> },
  { path: ADMIN_ROUTES.APPOINTMENT_CALENDAR, element: <AppointmentCalendarPage />},
  { path: ADMIN_ROUTES.APPOINTMENT_DETAILS, element: <AdminAppointmentDetailsPage /> },
  { path: ADMIN_ROUTES.EMPLOYEE, element: <EmployeesPage /> },
  {path: ADMIN_ROUTES.EMPLOYEE_NEW, element: <EmployeeCreationPage /> },
  {path: ADMIN_ROUTES.EMPLOYEE_DETAILS, element: <EmployeeDetailsPage />},
  {path: ADMIN_ROUTES.EMPLOYEE_EDIT, element: <EmployeeEditionPage />},
  {path: ADMIN_ROUTES.EMPLOYEE_SCHEDULE, element: <EmployeeCalendarPage />},
  { path: ADMIN_ROUTES.CUSTOMER, element: <CustomerPage /> },
  { path: ADMIN_ROUTES.SERVICE, element: <ServicesPage /> },
  { path: ADMIN_ROUTES.SERVICE_CREATION, element: <ServiceCreationPage /> },
  { path: ADMIN_ROUTES.SERVICE_EDIT, element: <ServiceEditionPage /> },
  {path: ADMIN_ROUTES.PAYMENT, element: <AdminPaymentManagement />}
];

export const baseRoutesPaths = [
  { path: BASE_ROUTES.LANDING, element: <Landing /> },
];
