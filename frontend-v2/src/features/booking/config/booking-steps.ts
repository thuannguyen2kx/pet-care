import { BOOKING_STEP, type BookingStep } from '@/features/booking/domain/booking.state';

export type BookingStepMeta = {
  id: BookingStep;
  order: number;
  name: string;
  description: string;
};
export const BOOKING_STEPS = [
  {
    id: BOOKING_STEP.SELECT_PET,
    order: 1,
    name: 'Thú cưng',
    description: 'Chọn thú cưng của bạn',
  },
  {
    id: BOOKING_STEP.SELECT_EMPLOYEE,
    order: 2,
    name: 'Chuyên viên',
    description: 'Chọn người chăm sóc',
  },
  {
    id: BOOKING_STEP.SELECT_DATETIME,
    order: 3,
    name: 'Thời gian',
    description: 'Chọn ngày và giờ',
  },
  {
    id: BOOKING_STEP.CONFIRM,
    order: 4,
    name: 'Xác nhận',
    description: 'Xác nhận đặt lịch',
  },
];
