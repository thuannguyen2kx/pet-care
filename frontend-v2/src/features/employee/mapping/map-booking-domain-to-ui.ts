import {
  EMPLOYEE_BOOKING_ACCEPTING,
  EMPLOYEE_BOOKING_ALL,
  EMPLOYEE_BOOKING_NOT_ACCEPTING,
} from '@/features/employee/constants';
import type { TBookingFilterValue } from '@/features/employee/types';

export const mapBookingDomainToUI = (value?: boolean): TBookingFilterValue => {
  if (value === true) return EMPLOYEE_BOOKING_ACCEPTING;
  if (value === false) return EMPLOYEE_BOOKING_NOT_ACCEPTING;
  return EMPLOYEE_BOOKING_ALL;
};
