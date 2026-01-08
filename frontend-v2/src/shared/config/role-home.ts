import { paths } from '@/shared/config/paths';
import { ROLES, type TRole } from '@/shared/constant';

export const ROLE_HOME_PATH: Record<TRole, string> = {
  [ROLES.ADMIN]: paths.admin.root.path,
  [ROLES.EMPLOYEE]: paths.employee.root.path,
  [ROLES.CUSTOMER]: paths.customer.root.path,
};
