import { Navigate, Outlet, useLocation } from 'react-router';

import { ConfirmProvider } from '@/shared/components/confirm';
import { SplashScreen } from '@/shared/components/template/splash-screen';
import { paths } from '@/shared/config/paths';
import { ROLES } from '@/shared/constant/roles';
import { useRoleTheme } from '@/shared/hooks/use-role-theme';
import { AuthLoader, useUser } from '@/shared/lib/auth';

export const ErrorBoundary = () => {
  return <div>Something went wrong</div>;
};

const AppRoot = () => {
  const user = useUser();
  const location = useLocation();
  useRoleTheme(user.data?.role || ROLES.CUSTOMER);

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
