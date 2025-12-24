import React from 'react';
import { Outlet } from 'react-router';

import { useUser } from './auth';
import { type TRole } from '../constant/roles';

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthrization = () => {
  const user = useUser();

  if (!user.data) {
    throw Error('User doest not exist');
  }

  const checkAccess = React.useCallback(
    ({ allowedRoles }: { allowedRoles: TRole[] }) => {
      if (allowedRoles && allowedRoles.length > 0 && user.data) {
        return allowedRoles.includes(user.data.role);
      }
      return true;
    },
    [user],
  );

  return { checkAccess, role: user.data?.role };
};
type AuthorizationProps = {
  forbiddenFallback?: React.ReactNode;
  children?: React.ReactNode;
  allowedRoles: TRole[];
};

export const Authorization = ({
  allowedRoles,
  children,
  forbiddenFallback = null,
}: AuthorizationProps) => {
  const { checkAccess } = useAuthrization();
  const canAccess = checkAccess({ allowedRoles });

  return (
    <>
      {canAccess ? (
        <>
          {children}
          <Outlet />
        </>
      ) : (
        forbiddenFallback
      )}
    </>
  );
};
