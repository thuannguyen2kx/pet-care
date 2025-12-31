import { USER_STATUS } from '@/features/user/domain/user-status';
import { paths } from '@/shared/config/paths';
import { ROLES } from '@/shared/constant';
import type { TUserIdentity } from '@/shared/types';

export function resolveHomeRoute(identity: TUserIdentity) {
  if (identity.status !== USER_STATUS.ACTIVE) {
    return paths.auth.suspended.path;
  }

  switch (identity.role) {
    case ROLES.ADMIN:
      return paths.admin.root.path;

    case ROLES.EMPLOYEE:
      return paths.employee.root.path;

    case ROLES.CUSTOMER:
      return paths.customer.root.path;

    default:
      return paths.auth.login.path;
  }
}
