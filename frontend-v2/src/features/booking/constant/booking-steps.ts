import { BOOKING_STEP_ID, type BookingStepMeta } from '../domain/booking-step';

export const BOOKING_STEPS: BookingStepMeta[] = [
  {
    id: BOOKING_STEP_ID.SELECT_PET,
    order: 1,
    name: 'Thú cưng',
    description: 'Chọn thú cưng của bạn',
  },
  {
    id: BOOKING_STEP_ID.SELECT_EMPLOYEE,
    order: 2,
    name: 'Chuyên viên',
    description: 'Chọn người chăm sóc',
  },
  {
    id: BOOKING_STEP_ID.SELECT_DATETIME,
    order: 3,
    name: 'Thời gian',
    description: 'Chọn ngày và giờ',
  },
  {
    id: BOOKING_STEP_ID.CONFIRM,
    order: 4,
    name: 'Xác nhận',
    description: 'Xác nhận đặt lịch',
  },
];
