import { ROLES } from '@/shared/constant';
import type { TGetMeResponse } from '@/shared/types/api-response';

export const isStaff = (user: TGetMeResponse) =>
  user.identity.role === ROLES.EMPLOYEE || user.identity.role === ROLES.ADMIN;

export const isCustomer = (user: TGetMeResponse) => user.identity.role === ROLES.CUSTOMER;
