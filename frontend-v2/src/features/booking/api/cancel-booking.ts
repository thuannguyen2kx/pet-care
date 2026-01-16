import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { bookingQueryKeys } from '@/features/booking/api/query-keys';
import type { CancelBookingDto } from '@/features/booking/domain/booking.dto';
import { cancelBookingSchema, type CancelBooking } from '@/features/booking/domain/booking.state';
import { mapCancelBookingToDto } from '@/features/booking/domain/booking.transform';
import { BOOKING_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';

const cancelBooking = async ({
  bookingId,
  cancelBookingDto,
}: {
  bookingId: string;
  cancelBookingDto: CancelBookingDto;
}): Promise<unknown> => {
  return http.post(BOOKING_ENDPOINTS.CANCEL(bookingId), cancelBookingDto);
};

type UseCancelBookingMutationOptions = {
  mutationOptions?: UseMutationOptions<unknown, unknown, CancelBooking, unknown>;
};

export const useCancelBooking = ({ mutationOptions }: UseCancelBookingMutationOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationOptions ?? {};
  return useMutation({
    mutationFn: (cancelBookingData: CancelBooking) => {
      const validateInput = cancelBookingSchema.parse(cancelBookingData);
      const cancelBookingDto = mapCancelBookingToDto(validateInput);
      return cancelBooking({
        bookingId: validateInput.bookingId,
        cancelBookingDto,
      });
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.customer.lists() });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
};

export const useAdminCancelBooking = ({
  mutationOptions,
}: UseCancelBookingMutationOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationOptions ?? {};
  return useMutation({
    mutationFn: (cancelBookingData: CancelBooking) => {
      const validateInput = cancelBookingSchema.parse(cancelBookingData);
      const cancelBookingDto = mapCancelBookingToDto(validateInput);
      return cancelBooking({
        bookingId: validateInput.bookingId,
        cancelBookingDto,
      });
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.admin.lists() });
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.admin.detail(args[1].bookingId) });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
export const useEmployeeCancelBooking = ({
  mutationOptions,
}: UseCancelBookingMutationOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationOptions ?? {};
  return useMutation({
    mutationFn: (cancelBookingData: CancelBooking) => {
      const validateInput = cancelBookingSchema.parse(cancelBookingData);
      const cancelBookingDto = mapCancelBookingToDto(validateInput);
      return cancelBooking({
        bookingId: validateInput.bookingId,
        cancelBookingDto,
      });
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.employee.lists() });
      queryClient.invalidateQueries({
        queryKey: bookingQueryKeys.employee.detail(args[1].bookingId),
      });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
