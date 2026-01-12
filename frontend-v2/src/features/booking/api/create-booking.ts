import { useMutation } from '@tanstack/react-query';

import { createBookingSchema, type CreateBooking } from '@/features/booking/domain/booking.state';
import { mapCreateBookingToDto } from '@/features/booking/domain/booking.transform';
import { BOOKING_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { MutationConfig } from '@/shared/lib/react-query';

const createBooking = (createBookingData: CreateBooking) => {
  const validatedInput = createBookingSchema.parse(createBookingData);
  const createBookingDto = mapCreateBookingToDto(validatedInput);

  return http.post(BOOKING_ENDPOINTS.CREATE, createBookingDto);
};

type UseCreateBookingOptions = {
  mutationConfig?: MutationConfig<typeof createBooking>;
};

export const useCreateBooking = ({ mutationConfig }: UseCreateBookingOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    onSuccess(data, variables, onMutateResult, context) {
      onSuccess?.(data, variables, onMutateResult, context);
    },
    ...restConfig,
    mutationFn: createBooking,
  });
};
