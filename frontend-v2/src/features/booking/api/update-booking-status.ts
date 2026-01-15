import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { bookingQueryKeys } from '@/features/booking/api/query-keys';
import type { UpdateBookingStatusDto } from '@/features/booking/domain/booking.dto';
import {
  updateBookingStatusSchema,
  type UpdateBookingStatus,
} from '@/features/booking/domain/booking.state';
import { mapUpdateBookingStatusToDto } from '@/features/booking/domain/booking.transform';
import { BOOKING_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';

const updateBookingStatus = ({
  bookingId,
  updateBookingStatusDto,
}: {
  bookingId: string;
  updateBookingStatusDto: UpdateBookingStatusDto;
}) => {
  return http.patch(BOOKING_ENDPOINTS.UPDATE_STATUS(bookingId), updateBookingStatusDto);
};

type UseAdminUpdateBookingStatusOptions = {
  mutationOptions?: UseMutationOptions<unknown, unknown, UpdateBookingStatus, unknown>;
};
export const useAdminUpdateBookingStatus = ({
  mutationOptions,
}: UseAdminUpdateBookingStatusOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationOptions ?? {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.admin.lists() });
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.admin.detail(args[1].bookingId) });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: (updateBookingStatusData: UpdateBookingStatus) => {
      const validateInput = updateBookingStatusSchema.parse(updateBookingStatusData);
      const updateBookingStatusDto = mapUpdateBookingStatusToDto(validateInput);
      return updateBookingStatus({ bookingId: validateInput.bookingId, updateBookingStatusDto });
    },
  });
};
