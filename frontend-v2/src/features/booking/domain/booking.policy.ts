import { BOOKING_STATUS, type BookingStatus } from '@/features/booking/domain/booking.entity';

export const BOOKING_STATUS_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  [BOOKING_STATUS.PENDING]: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.NO_SHOW],

  [BOOKING_STATUS.CONFIRMED]: [BOOKING_STATUS.IN_PROGRESS, BOOKING_STATUS.NO_SHOW],

  [BOOKING_STATUS.IN_PROGRESS]: [BOOKING_STATUS.COMPLETED, BOOKING_STATUS.NO_SHOW],

  [BOOKING_STATUS.COMPLETED]: [],

  [BOOKING_STATUS.NO_SHOW]: [],

  [BOOKING_STATUS.CANCELLED]: [],
};
export const getAvailableStatusActions = (status: BookingStatus) => {
  return BOOKING_STATUS_TRANSITIONS[status];
};
