import { ZodError } from 'zod';

import {
  BOOKING_STEP,
  stepDateTimeSchema,
  stepEmployeeSchema,
  stepPetSchema,
  type BookingStep,
  type CompleteCreateBookingDraft,
  type CreateBookingDraft,
} from '@/features/booking/domain/booking.state';

export const isCompleteCreateBookingDraft = (
  draft: CreateBookingDraft,
): draft is CompleteCreateBookingDraft => {
  return !!(draft.petId && draft.employeeId && draft.scheduledDate && draft.startTime);
};

// ===========================
// VALIDATION RESULT
// ===========================
export type ValidationResult =
  | { success: true }
  | { success: false; errors: Record<string, string> };
// ===========================
// STEP VALIDATION
// ===========================
export function validateCreateBookingStep(
  currentStep: BookingStep,
  bookingDraft: CreateBookingDraft,
): ValidationResult {
  try {
    switch (currentStep) {
      case BOOKING_STEP.SELECT_PET:
        stepPetSchema.parse(bookingDraft);
        break;
      case BOOKING_STEP.SELECT_EMPLOYEE:
        stepEmployeeSchema.parse(bookingDraft);
        break;

      case BOOKING_STEP.SELECT_DATETIME:
        stepDateTimeSchema.parse(bookingDraft);
        break;

      case BOOKING_STEP.CONFIRM:
        if (!isCompleteCreateBookingDraft(bookingDraft)) {
          return {
            success: false,
            errors: { _general: 'Vui lòng nhập đầy đủ thông tin để tạo lịch đặt' },
          };
        }
        break;
    }

    return { success: true };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors: Record<string, string> = {};
      for (const issue of error.issues) {
        const field = (issue.path.join('.') as keyof CreateBookingDraft) || '_general';
        if (!errors[field]) {
          errors[field] = issue.message;
        }
      }

      return { success: false, errors };
    }

    return {
      success: false,
      errors: { _general: (error as Error).message },
    };
  }
}

export function canProceedToNextBookingStep(step: BookingStep, draft: CreateBookingDraft): boolean {
  return validateCreateBookingStep(step, draft).success;
}
