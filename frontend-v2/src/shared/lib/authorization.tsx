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
        return allowedRoles.includes(user.data.identity.role);
      }
      return true;
    },
    [user],
  );

  return { checkAccess, role: user.data?.identity.role };
};
// type AuthorizationProps = {
//   forbiddenFallback?: React.ReactNode;
//   children?: React.ReactNode;
//   allowedRoles: TRole[];
// };

// export const Authorization = ({
//   allowedRoles,
//   children,
//   forbiddenFallback = null,
// }: AuthorizationProps) => {
//   const { checkAccess } = useAuthrization();
//   const canAccess = checkAccess({ allowedRoles });

//   return (
//     <>
//       {canAccess ? (
//         <>
//           {children}
//           <Outlet />
//         </>
//       ) : (
//         forbiddenFallback
//       )}
//     </>
//   );
// };
type AuthorizationProps = {
  guard: (role: TRole) => boolean;
  forbiddenFallback?: React.ReactNode;
  children?: React.ReactNode;
};

export const Authorization = ({
  guard,
  forbiddenFallback = null,
  children,
}: AuthorizationProps) => {
  const user = useUser();

  if (!user.data) {
    return null;
  }

  const canAccess = guard(user.data.identity.role);

  return canAccess ? (
    <>
      {children}
      <Outlet />
    </>
  ) : (
    forbiddenFallback
  );
};
