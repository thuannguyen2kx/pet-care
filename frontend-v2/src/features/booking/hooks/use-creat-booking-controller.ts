import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { useCreateBooking } from '@/features/booking/api/create-booking';
import { useGetAvailableSlots } from '@/features/booking/api/get-available-slots';
import { useGetBookableEmployees } from '@/features/booking/api/get-bookable-employees';
import { BOOKING_STEP_ID, type BookingStepId } from '@/features/booking/domain/booking-step';
import { useBookingSummary } from '@/features/booking/hooks/use-booking-summary';
import { useGetUserPets } from '@/features/pets/api/get-user-pet';
import { useGetService } from '@/features/service/api/get-service';
import { paths } from '@/shared/config/paths';

export interface BookingDraft {
  serviceId: string;
  petId: string | null;
  employeeId: string | null;
  date: string | null;
  time: string | null;
  notes: string;
}
type CompleteBookingDraft = BookingDraft & {
  petId: string;
  employeeId: string;
  date: string;
  time: string;
};

export function canGoNext(step: BookingStepId, state: BookingDraft): boolean {
  switch (step) {
    case BOOKING_STEP_ID.SELECT_PET:
      return Boolean(state.petId);

    case BOOKING_STEP_ID.SELECT_EMPLOYEE:
      return Boolean(state.employeeId);

    case BOOKING_STEP_ID.SELECT_DATETIME:
      return Boolean(state.date && state.time);

    case BOOKING_STEP_ID.CONFIRM:
      return true;

    default:
      return false;
  }
}

export function useBookingController(serviceId: string) {
  const navigate = useNavigate();
  const [step, setStep] = useState<BookingStepId>(BOOKING_STEP_ID.SELECT_PET);

  const [draft, setDraft] = useState<BookingDraft>({
    serviceId,
    petId: null,
    employeeId: null,
    date: null,
    time: null,
    notes: '',
  });

  const isLastStep = step === BOOKING_STEP_ID.CONFIRM;

  const canNext = canGoNext(step, draft);

  const canBack = step !== BOOKING_STEP_ID.SELECT_PET;

  const onNext = () => {
    if (!canGoNext(step, draft)) return;

    setStep((prev) => {
      switch (prev) {
        case BOOKING_STEP_ID.SELECT_PET:
          return BOOKING_STEP_ID.SELECT_EMPLOYEE;
        case BOOKING_STEP_ID.SELECT_EMPLOYEE:
          return BOOKING_STEP_ID.SELECT_DATETIME;
        case BOOKING_STEP_ID.SELECT_DATETIME:
          return BOOKING_STEP_ID.CONFIRM;
        default:
          return prev;
      }
    });
  };

  const onBack = () => {
    setStep((prev) => {
      switch (prev) {
        case BOOKING_STEP_ID.SELECT_EMPLOYEE:
          return BOOKING_STEP_ID.SELECT_PET;
        case BOOKING_STEP_ID.SELECT_DATETIME:
          return BOOKING_STEP_ID.SELECT_EMPLOYEE;
        case BOOKING_STEP_ID.CONFIRM:
          return BOOKING_STEP_ID.SELECT_DATETIME;
        default:
          return prev;
      }
    });
  };

  const setPet = (petId: string) => setDraft((s) => ({ ...s, petId }));

  const setEmployee = (employeeId: string) =>
    setDraft((d) => ({
      ...d,
      employeeId,
      date: null,
      time: null,
    }));

  const setDate = (date: string) =>
    setDraft((d) => ({
      ...d,
      date,
      time: null,
    }));

  const setTime = (time: string) => setDraft((d) => ({ ...d, time }));

  const setNotes = (notes: string) => setDraft((d) => ({ ...d, notes }));
  // ===== Query conditions =====

  const canFetchEmployees =
    step === BOOKING_STEP_ID.SELECT_EMPLOYEE && !!draft.petId && !!serviceId;

  const canFetchDatestime =
    step === BOOKING_STEP_ID.SELECT_DATETIME && !!draft.employeeId && !!draft.date;

  const serviceQuery = useGetService({
    serviceId,
    queryConfig: {
      enabled: !!serviceId,
    },
  });

  const petsQuery = useGetUserPets();

  const employeesQuery = useGetBookableEmployees({
    serviceId,
    queryConfig: {
      enabled: canFetchEmployees,
    },
  });

  const slotsQuery = useGetAvailableSlots({
    query: {
      serviceId: draft.serviceId,
      employeeId: draft.employeeId!,
      date: draft.date!,
    },
    queryConfig: {
      enabled: canFetchDatestime,
    },
  });

  const summary = useBookingSummary({
    draft,
    service: serviceQuery.data?.data.service,
    pets: petsQuery.data?.data,
    employees: employeesQuery.data?.data.employees,
  });

  // ====== Submit ========
  function isCompleteDraft(draft: BookingDraft): draft is CompleteBookingDraft {
    return !!draft.petId && !!draft.employeeId && !!draft.date && !!draft.time;
  }
  const createBooking = useCreateBooking({
    mutationConfig: {
      onSuccess: () => {
        resetBooking();
        toast.success('Đã đặt lịch thành công');
        navigate(paths.customer.successBooking.path);
      },
    },
  });

  const submitBooking = () => {
    if (!isCompleteDraft(draft)) {
      toast.error('Vui lòng hoàn tất thông tin đặt lịch');
      return;
    }

    createBooking.mutate({
      serviceId: draft.serviceId,
      petId: draft.petId,
      employeeId: draft.employeeId,
      scheduledDate: draft.date,
      startTime: draft.time,
      customerNotes: draft.notes,
    });
  };

  const resetBooking = () => {
    setStep(BOOKING_STEP_ID.SELECT_PET);
    setDraft({
      serviceId,
      petId: null,
      employeeId: null,
      date: null,
      time: null,
      notes: '',
    });
  };

  return {
    step,
    isLastStep,
    canNext,
    canBack,

    draft,
    serviceQuery,
    petsQuery,
    employeesQuery,
    slotsQuery,
    summary,
    onNext,
    onBack,

    setPet,
    setEmployee,
    setDate,
    setTime,
    setNotes,

    canFetchEmployees,
    canFetchDatestime,

    submitBooking,
    isCreating: createBooking.isPending,
  };
}
