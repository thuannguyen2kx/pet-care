import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

import { createBookingResponseDtoSchema } from '@/features/booking/domain/booking-http-schema';
import type { CreateBookingDto } from '@/features/booking/domain/booking.dto';
import { type CreateBooking } from '@/features/booking/domain/booking.state';
import { mapCreateBookingToDto } from '@/features/booking/domain/booking.transform';
import { BOOKING_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';

const createBooking = (createBookingDto: CreateBookingDto) => {
  return http.post(BOOKING_ENDPOINTS.CREATE, createBookingDto);
};

type UseCreateBookingOptions = {
  mutationConfig?: UseMutationOptions<{ bookingId: string }, Error, CreateBooking, unknown>;
};

export const useCreateBooking = ({ mutationConfig }: UseCreateBookingOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    onSuccess(data, variables, onMutateResult, context) {
      onSuccess?.(data, variables, onMutateResult, context);
    },
    ...restConfig,
    mutationFn: async (createBookingData: CreateBooking) => {
      const createBookingDto = mapCreateBookingToDto(createBookingData);
      const raw = await createBooking(createBookingDto);
      const response = createBookingResponseDtoSchema.parse(raw);
      return {
        bookingId: response.booking._id,
      };
    },
  });
};
