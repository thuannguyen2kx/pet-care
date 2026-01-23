import { useEffect } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router';

import { ConfirmProvider } from '@/shared/components/confirm';
import { SplashScreen } from '@/shared/components/template/splash-screen';
import { paths } from '@/shared/config/paths';
import { ROLES } from '@/shared/constant/roles';
import { useRoleTheme } from '@/shared/hooks/use-role-theme';
import { AuthLoader, useUser } from '@/shared/lib/auth';
import { LocalStorageEventTarget } from '@/shared/lib/storage';

export const ErrorBoundary = () => {
  return <div>Something went wrong</div>;
};

export const RootListener = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleTokenCleared = () => {
      navigate(paths.auth.login.path, { replace: true });
    };

    LocalStorageEventTarget.addEventListener('tokenCleared', handleTokenCleared);
    return () => {
      LocalStorageEventTarget.removeEventListener('tokenCleared', handleTokenCleared);
    };
  }, [navigate]);

  return <Outlet />;
};

const AppRoot = () => {
  const user = useUser();
  const location = useLocation();
  useRoleTheme(user.data?.identity.role || ROLES.CUSTOMER);

  return (
    <>
      <AuthLoader
        renderLoading={() => <SplashScreen />}
        renderError={() => <Navigate to={paths.auth.login.getHref(location.pathname)} replace />}
      >
        <ConfirmProvider>
          <Outlet />
        </ConfirmProvider>
      </AuthLoader>
    </>
  );
};

export default AppRoot;
