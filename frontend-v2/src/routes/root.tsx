import { Outlet } from 'react-router';

import { useRoleTheme } from '@/shared/hooks/use-role-theme';

export const ErrorBoundary = () => {
  return <div>Something went wrong</div>;
};

const AppRoot = () => {
  useRoleTheme('customer');
  return (
    <>
      <Outlet />
    </>
  );
};

export default AppRoot;
