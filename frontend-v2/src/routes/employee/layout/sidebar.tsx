import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  PawPrint,
  UserCircle,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';

import { useConfirmDialog } from '@/shared/components/confirm';
import { paths } from '@/shared/config/paths';
import { useLogout } from '@/shared/lib/auth';
import { cn, getInitials } from '@/shared/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';

const employeeNavItems = [
  { href: paths.employee.root.path, label: 'Dashboard', icon: LayoutDashboard },
  { href: paths.employee.profile.path, label: 'Thông tin cá nhân', icon: UserCircle },
  { href: paths.employee.schedule.path, label: 'Lịch làm việc', icon: Calendar },
  { href: paths.employee.bookings.path, label: 'Lịch hẹn của tôi', icon: PawPrint },
];

type Props = {
  fullName: string;
  imageUrl?: string;
  email: string;
};
export function EmployeeDashboardSidebar({ fullName, imageUrl, email }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const confirm = useConfirmDialog();
  const logout = useLogout({
    onSuccess: () => {
      navigate(paths.auth.login.path, { replace: true });
    },
  });

  const handleLogout = async () => {
    const ok = await confirm({
      title: 'Đăng xuất',
      message: 'Xác nhận đăng xuất tài khoản?',
      confirmText: 'Đăng xuất',
    });
    if (!ok) return;
    logout.mutate(undefined, {
      onSuccess: () => {
        navigate(paths.auth.login.path, { replace: true });
      },
    });
  };

  return (
    <aside
      className={cn(
        'bg-sidebar border-sidebar-border sticky top-0 flex h-screen flex-col border-r transition-all duration-300',
        collapsed ? 'w-18' : 'w-64',
      )}
    >
      <div className="border-sidebar-border flex items-center gap-3 border-b px-4 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl">
          <img src="/logo.svg" className="h-full w-full object-cover" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sidebar-foreground font-semibold">PetCare</span>
            <span className="text-muted-foreground text-xs capitalize">Trang nhân viên</span>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {employeeNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              )}
            >
              <item.icon className={cn('h-5 w-5 shrink-0', collapsed && 'mx-auto')} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-sidebar-border border-t p-3">
        <div
          className={cn(
            'hover:bg-sidebar-accent flex cursor-pointer items-center gap-3 rounded-xl p-2 transition-colors',
            collapsed && 'justify-center',
          )}
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={imageUrl || '/placeholder.svg'} alt={fullName} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm">
              {getInitials(fullName)}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sidebar-foreground truncate text-sm font-medium">{fullName}</p>
              <p className="text-muted-foreground truncate text-xs">{email}</p>
            </div>
          )}
        </div>

        {!collapsed && (
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 mt-2 w-full cursor-pointer justify-start"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Đăng xuất
          </Button>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed(!collapsed)}
        className="bg-card border-border hover:bg-accent absolute top-7 -right-3 h-6 w-6 cursor-pointer rounded-full border shadow-sm"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>
    </aside>
  );
}
