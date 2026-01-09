export const BOOKING_STEP_ID = {
  SELECT_PET: 'SELECT_PET',
  SELECT_EMPLOYEE: 'SELECT_EMPLOYEE',
  SELECT_DATETIME: 'SELECT_DATETIME',
  CONFIRM: 'CONFIRM',
} as const;

export type BookingStepId = (typeof BOOKING_STEP_ID)[keyof typeof BOOKING_STEP_ID];

export interface BookingStepMeta {
  id: BookingStepId;
  order: number;
  name: string;
  description?: string;
}
