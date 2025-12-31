import { ROLES, type TRole } from '@/shared/constant';

export const UserPermissions = {
  canAccessCustomerArea: (role: TRole) => role === ROLES.CUSTOMER,

  canAccessEmployeeArea: (role: TRole) => role === ROLES.EMPLOYEE || role === ROLES.ADMIN,

  canAccessAdminArea: (role: TRole) => role === ROLES.ADMIN,
};
