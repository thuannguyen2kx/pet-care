import { useQueryClient } from '@tanstack/react-query';
import {
  Bell,
  Calendar,
  ChevronDown,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  PawPrint,
  Search,
  Settings,
  User,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { paths } from '@/shared/config/paths';
import { useLogout, useUser } from '@/shared/lib/auth';
import { getInitials } from '@/shared/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Logo } from '@/shared/ui/logo';

const navItems = [
  { label: 'Trang chủ', href: paths.customer.root.path, icon: Home },
  { label: 'Thú cưng', href: paths.customer.pets.path, icon: PawPrint },
  { label: 'Đặt lịch', href: paths.customer.booking.path, icon: Calendar },
  { label: 'Cộng đồng', href: paths.customer.social.path, icon: MessageCircle },
];

export const Header = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const user = useUser();
  const logout = useLogout();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        queryClient.clear();
        navigate(paths.auth.login.path, { replace: true });
      },
    });
  };
  if (!user.data) return null;
  const { profile } = user.data || {};
  return (
    <header className="border-border bg-background/95 supports-backdrop-filter:bg-backgroud/60 sticky top-0 z-50 w-full border backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to={paths.customer.root.path}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Search */}
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Search className="h-5 w-5" />
            <span className="sr-only">Tìm kiếm</span>
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="bg-destructive absolute top-1.5 right-1.5 h-2 w-2 rounded-full" />
            <span className="sr-only">Thông báo</span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="hidden gap-2 pr-1 pl-2 md:flex">
                <Avatar>
                  <AvatarImage src={profile.avatarUrl || ''} />
                  <AvatarFallback>{getInitials(profile.displayName)}</AvatarFallback>
                </Avatar>
                <ChevronDown className="text-muted-foreground h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-border w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{profile.displayName}</p>
                <p className="text-muted-foreground text-xs">{profile.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={paths.customer.profile.path} className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Hồ sơ cá nhân
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={paths.customer.settings.path} className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Cài đặt
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="text-destructive flex w-full cursor-pointer justify-start gap-2"
                >
                  <LogOut className="text-destructive h-4 w-4" />
                  Đăng xuất
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Button */}
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-border bg-background border-t md:hidden">
          <nav className="container mx-auto flex flex-col gap-1 px-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
            <div className="border-border mt-2 border-t pt-4">
              <div className="flex items-center gap-3 px-3 py-2">
                <Avatar>
                  <AvatarImage src={profile.avatarUrl || '/placeholder.svg'} />
                  <AvatarFallback>{getInitials(profile.displayName)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{profile.displayName}</p>
                  <p className="text-muted-foreground text-xs">{profile.email}</p>
                </div>
              </div>
              <Link
                to={paths.customer.profile.path}
                className="text-muted-foreground hover:bg-muted hover:text-foreground mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-5 w-5" />
                Hồ sơ cá nhân
              </Link>
              <Link
                to={paths.customer.settings.path}
                className="text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Settings className="h-5 w-5" />
                Cài đặt
              </Link>
              <Button
                variant="ghost"
                className="text-destructive hover:bg-destructive/10 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLogout();
                }}
              >
                <LogOut className="h-5 w-5" />
                Đăng xuất
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
