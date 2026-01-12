import { useState } from 'react';

import {
  BOOKING_STEP,
  type BookingStep,
  type CreateBookingDraft,
} from '@/features/booking/domain/booking.state';
import { createInitialBookingDraf } from '@/features/booking/domain/booking.transform';

/**
 * Manages the booking draft state and step navigation.
 *
 * Handles:
 * - Current step tracking
 * - Draft state updates
 * - Field selection with dependency reset
 * - State reset
 *
 * @param serviceId - Initial service ID for the booking
 * @returns State and actions for booking creation
 *
 * @example
 * ```tsx
 * const state = useCreateBookingState(serviceId);
 *
 * // Select employee (resets date/time)
 * state.selectEmployee('emp-123');
 *
 * // Navigate steps
 * state.goToNextStep();
 * ```
 */
export function useCreateBookingState(serviceId: string) {
  const [currentStep, setCurrentStep] = useState<BookingStep>(BOOKING_STEP.SELECT_PET);

  const [bookingDraft, setBookingDraft] = useState(() => createInitialBookingDraf(serviceId));

  const updateDraft = (updates: Partial<CreateBookingDraft>) => {
    setBookingDraft((prev) => ({ ...prev, ...updates }));
  };
  const resetDraft = () => {
    setBookingDraft(createInitialBookingDraf(serviceId));
    setCurrentStep(BOOKING_STEP.SELECT_PET);
  };

  const goToNextStep = () => {
    setCurrentStep((prev) => {
      switch (prev) {
        case BOOKING_STEP.SELECT_PET:
          return BOOKING_STEP.SELECT_EMPLOYEE;
        case BOOKING_STEP.SELECT_EMPLOYEE:
          return BOOKING_STEP.SELECT_DATETIME;
        case BOOKING_STEP.SELECT_DATETIME:
          return BOOKING_STEP.CONFIRM;
        default:
          return prev;
      }
    });
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => {
      switch (prev) {
        case BOOKING_STEP.SELECT_EMPLOYEE:
          return BOOKING_STEP.SELECT_PET;
        case BOOKING_STEP.SELECT_DATETIME:
          return BOOKING_STEP.SELECT_EMPLOYEE;
        case BOOKING_STEP.CONFIRM:
          return BOOKING_STEP.SELECT_DATETIME;
        default:
          return prev;
      }
    });
  };

  const selectPet = (petId: string) => {
    updateDraft({ petId });
  };

  const selectEmployee = (employeeId: string) => {
    updateDraft({
      employeeId,
      scheduledDate: null,
      startTime: null,
    });
  };

  const selectScheduledDate = (date: string) => {
    updateDraft({
      scheduledDate: date,
      startTime: null,
    });
  };

  const selectStartTime = (startTime: string) => {
    updateDraft({ startTime });
  };

  const updateCustomerNotes = (customerNotes: string) => {
    updateDraft({ customerNotes });
  };

  return {
    currentStep,
    bookingDraft,
    resetDraft,
    goToNextStep,
    goToPreviousStep,
    selectPet,
    selectEmployee,
    selectScheduledDate,
    selectStartTime,
    updateCustomerNotes,
  };
}
