import { ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router';

import { paths } from '@/shared/config/paths';
import { ROLE_HOME_PATH } from '@/shared/config/role-home';
import { useUser } from '@/shared/lib/auth';
import { Button } from '@/shared/ui/button';
import { Logo } from '@/shared/ui/logo';

export const Header = () => {
  const navigate = useNavigate();
  const user = useUser();

  const { profile, identity } = user.data || {};

  const handleGoDashboard = () => {
    const role = identity?.role;
    if (!role) return;
    navigate(ROLE_HOME_PATH[role]);
  };
  const logoHref = identity?.role ? ROLE_HOME_PATH[identity.role] : paths.root.path;

  return (
    <header className="border-border bg-background/95 supports-backdrop-filter:bg-backgroud/60 sticky top-0 z-50 w-full border backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to={logoHref}>
          <Logo />
        </Link>

        {profile && (
          <Button onClick={handleGoDashboard}>
            Trang của tôi
            <ArrowRight className="size-4.5" />
          </Button>
        )}
        {!profile && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-3">
              <Link to={paths.auth.login.path}>
                <Button variant="ghost" size="sm">
                  Đăng nhập
                </Button>
              </Link>
              <Link to={paths.auth.register.path}>
                <Button size="sm">Đăng ký</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
