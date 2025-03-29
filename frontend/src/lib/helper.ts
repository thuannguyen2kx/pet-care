import { Roles, RolesType } from "@/constants";
import { ADMIN_ROUTES, CUSTOMER_ROUTES, EMPLOYEE_ROUTES } from "@/routes/common/routePaths";

export const getRedirectUrl = (role: RolesType): string => {
  switch (role) {
    case Roles.ADMIN:
      return ADMIN_ROUTES.DASHBOARD;
    case Roles.EMPLOYEE:
      return EMPLOYEE_ROUTES.DASHBOARD;
    case Roles.CUSTOMER:
      return CUSTOMER_ROUTES.HOME;
    default:
      return "/";
  }
};

export const getAvatarFallbackText = (name: string) => {
  if (!name) return "NA";
  const initials = name
    .split(" ")
    .map((n) => n.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2); // Ensure only two initials
  return initials || "NA";
};