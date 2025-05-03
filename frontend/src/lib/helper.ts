import { Roles, RolesType } from "@/constants";
import {
  ADMIN_ROUTES,
  CUSTOMER_ROUTES,
  EMPLOYEE_ROUTES,
} from "@/routes/common/routePaths";

export const getRedirectUrl = (role: RolesType): string => {
  switch (role) {
    case Roles.ADMIN:
      return ADMIN_ROUTES.DASHBOARD;
    case Roles.EMPLOYEE:
      return EMPLOYEE_ROUTES.HOME;
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

export const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const  formatVND = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};
export const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};