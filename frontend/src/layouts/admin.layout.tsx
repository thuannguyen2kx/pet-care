import {  Link, useLocation } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  Package,
  Calendar,
  UserPen,
  CreditCard,
  Newspaper,
} from "lucide-react";
import { ADMIN_ROUTES, MANAGER_ROUTES } from "@/routes/common/routePaths";
import { UserButton } from "@/features/user/components/user-button";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
};

const navItems = [
  {
    path: ADMIN_ROUTES.DASHBOARD,
    name: "Trang chủ",
    icon: <LayoutDashboard size={18} />,
  },
  {
    path: MANAGER_ROUTES.CUSTOMER,
    name: "Khác hàng",
    icon: <Users size={18} />,
  },
  {
    path: ADMIN_ROUTES.EMPLOYEE,
    name: "Nhân viên",
    icon: <UserPen size={18} />,
  },
  {
    path: MANAGER_ROUTES.SERVICES,
    name: "Dịch vụ",
    icon: <Package size={18} />,
  },
  {
    path: ADMIN_ROUTES.APPOINTMENT,
    name: "Lịch đặt",
    icon: <Calendar size={18} />,
  },
  {
    path: ADMIN_ROUTES.PAYMENT,
    name: "Thanh toán",
    icon: <CreditCard size={18} />,
  },
  {
    path: MANAGER_ROUTES.POST,
    name: "Bài viết",
    icon: <Newspaper size={18} />,
  },
];
const Header = () => {
  const location = useLocation();

  return (
    <header className="bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex space-x-6 items-center">
            <div className="flex items-center">
              <div className="bg-orange-500 text-white font-bold rounded-md p-2">
                Pet
              </div>
              <span className="ml-1 text-sm font-medium">Care</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm ${
                    location.pathname === item.path
                      ? "font-medium text-orange-600"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <UserButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminLayout;
