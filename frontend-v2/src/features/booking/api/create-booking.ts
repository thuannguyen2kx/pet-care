import { useMutation } from '@tanstack/react-query';

import type { TCreateBookingInput } from '@/features/booking/schemas';
import { BOOKING_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { MutationConfig } from '@/shared/lib/react-query';

const createBooking = (data: TCreateBookingInput) => {
  return http.post(BOOKING_ENDPOINTS.CREATE, data);
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
