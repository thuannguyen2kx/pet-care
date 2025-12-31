import type {
  EMPLOYEE_BOOKING_ACCEPTING,
  EMPLOYEE_BOOKING_ALL,
  EMPLOYEE_BOOKING_NOT_ACCEPTING,
} from '@/features/employee/constants';

export type TBookingFilterValue =
  | typeof EMPLOYEE_BOOKING_ALL
  | typeof EMPLOYEE_BOOKING_ACCEPTING
  | typeof EMPLOYEE_BOOKING_NOT_ACCEPTING;
