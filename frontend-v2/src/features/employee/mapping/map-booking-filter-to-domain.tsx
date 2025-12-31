import {
  EMPLOYEE_BOOKING_ACCEPTING,
  EMPLOYEE_BOOKING_NOT_ACCEPTING,
} from '@/features/employee/constants';
import type { TBookingFilterValue } from '@/features/employee/types';

export const mapBookingFilterToDomain = (value: TBookingFilterValue): boolean | undefined => {
  switch (value) {
    case EMPLOYEE_BOOKING_ACCEPTING:
      return true;
    case EMPLOYEE_BOOKING_NOT_ACCEPTING:
      return false;
    default:
      return undefined;
  }
};
