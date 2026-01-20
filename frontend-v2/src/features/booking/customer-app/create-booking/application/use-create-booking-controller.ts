import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { useAvailableSlots, useBookableEmployees } from '@/features/availability/api';
import { useCreateBooking } from '@/features/booking/api/create-booking';
import { useCreateBookingState } from '@/features/booking/customer-app/create-booking/application/use-create-booking-state';
import { useBookingSummary } from '@/features/booking/customer-app/create-booking/application/use-create-booking-summary';
import { BOOKING_STEP } from '@/features/booking/domain/booking.state';
import { mapDraftToCreateBookingInput } from '@/features/booking/domain/booking.transform';
import {
  canProceedToNextBookingStep,
  isCompleteCreateBookingDraft,
} from '@/features/booking/domain/booking.validation';
import { useGetUserPets } from '@/features/pets/api/get-user-pet';
import { useGetService } from '@/features/service/api/get-service';
import { paths } from '@/shared/config/paths';

/**
 * Controller hook for managing the multi-step booking creation flow.
 *
 * Orchestrates:
 * - Step navigation (pet → employee → datetime → confirm)
 * - Data fetching (service, pets, employees, slots)
 * - Form state management
 * - Booking submission
 *
 * @param serviceId - The service to book
 * @returns Controller state, data, status, and actions
 *
 * @example
 * ```tsx
 * function CreateBookingPage({ serviceId }) {
 *   const controller = useCreateBookingController(serviceId);
 *
 *   return (
 *     <BookingForm
 *       step={controller.state.step}
 *       onNext={controller.actions.goNextStep}
 *       onSubmit={controller.actions.submitBooking}
 *     />
 *   );
 * }
 * ```
 */
export const useCreateBookingController = (serviceId: string) => {
  const navigate = useNavigate();
  const state = useCreateBookingState(serviceId);

  const isLastStep = state.currentStep === BOOKING_STEP.CONFIRM;
  const canGoNext = canProceedToNextBookingStep(state.currentStep, state.bookingDraft);
  const canGoBack = state.currentStep !== BOOKING_STEP.SELECT_PET;

  const shouldFetchEmployees =
    state.currentStep === BOOKING_STEP.SELECT_EMPLOYEE && !!state.bookingDraft.petId && !!serviceId;

  const shouldFetchSlots =
    state.currentStep === BOOKING_STEP.SELECT_DATETIME &&
    !!state.bookingDraft.employeeId &&
    !!state.bookingDraft.scheduledDate;

  const serviceQuery = useGetService({
    serviceId,
    queryConfig: { enabled: !!serviceId },
  });

  const petsQuery = useGetUserPets();

  const employeesQuery = useBookableEmployees({
    serviceId,
    queryConfig: { enabled: shouldFetchEmployees },
  });

  const slotsQuery = useAvailableSlots({
    query: {
      serviceId: state.bookingDraft.serviceId,
      employeeId: state.bookingDraft.employeeId!,
      date: state.bookingDraft.scheduledDate!,
    },
    queryConfig: { enabled: shouldFetchSlots },
  });

  const summary = useBookingSummary({
    draft: state.bookingDraft,
    service: serviceQuery.data,
    pets: petsQuery.data,
    employees: employeesQuery.data,
  });

  const createBooking = useCreateBooking({
    mutationConfig: {
      onSuccess: () => {
        state.resetDraft();
        toast.success('Đã đặt lịch thành công');
        navigate(paths.customer.successBooking.path);
      },
      onError: (error) => {
        toast.error(error.message || 'Đặt lịch thất bại');
      },
    },
  });

  const handleNext = () => {
    if (!canGoNext) return;
    state.goToNextStep();
  };

  const handleBack = () => {
    if (!canGoBack) return;
    state.goToPreviousStep();
  };

  const submitBooking = () => {
    if (!isCompleteCreateBookingDraft(state.bookingDraft)) {
      toast.error('Vui lòng hoàn tất thông tin đặt lịch');
      return;
    }
    const createBookingData = mapDraftToCreateBookingInput(state.bookingDraft);
    createBooking.mutate(createBookingData);
  };

  return {
    state: {
      step: state.currentStep,
      draft: state.bookingDraft,
      isLastStep,
      canGoNext,
      canGoBack,
    },

    data: {
      service: serviceQuery.data,
      pets: petsQuery.data,
      employees: employeesQuery.data,
      slots: slotsQuery.data,
      summary,
    },

    status: {
      isLoadingService: serviceQuery.isLoading,
      isLoadingPets: petsQuery.isLoading,
      isLoadingEmployees: employeesQuery.isLoading,
      isLoadingSlots: slotsQuery.isLoading,
      isCreating: createBooking.isPending,
    },

    actions: {
      goNextStep: handleNext,
      goPreviousStep: handleBack,
      submitBooking,
      selectPet: state.selectPet,
      selectEmployee: state.selectEmployee,
      selectScheduledDate: state.selectScheduledDate,
      selectStartTime: state.selectStartTime,
      updateCustomerNotes: state.updateCustomerNotes,
    },
  };
};
