import React from 'react';
import { Outlet } from 'react-router';

export const ROLES = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
  CUSTOMER: 'customer',
} as const;

type TRole = (typeof ROLES)[keyof typeof ROLES];

export const useAuthrization = () => {
  const user = { role: ROLES.CUSTOMER };

  if (!user) {
    throw Error('User doest not exist');
  }

  const checkAccess = React.useCallback(
    ({ allowedRoles }: { allowedRoles: TRole[] }) => {
      if (allowedRoles && allowedRoles.length > 0 && user) {
        return allowedRoles.includes(user.role);
      }
      return true;
    },
    [user],
  );

  return { checkAccess, role: user.role };
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
