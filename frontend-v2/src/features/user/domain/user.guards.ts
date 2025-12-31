import { UserPermissions } from './user.permissions';

import type { TRole } from '@/shared/constant';

export type GuardFn = (role: TRole) => boolean;

export const Guards = {
  customerArea: (role: TRole) => UserPermissions.canAccessCustomerArea(role),

  employeeArea: (role: TRole) => UserPermissions.canAccessEmployeeArea(role),

  adminArea: (role: TRole) => UserPermissions.canAccessAdminArea(role),
};
