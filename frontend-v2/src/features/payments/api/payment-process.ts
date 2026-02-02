import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

import type { ProcessPaymentDto } from '@/features/payments/domain/payment.dto';
import { mapProcessPaymentToDto } from '@/features/payments/domain/payment.transform';
import type { ProcessPayment } from '@/features/payments/payment.state';
import { PAYMENTS_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';

const processPayment = ({
  bookingId,
  processPaymentDto,
}: {
  bookingId: string;
  processPaymentDto: ProcessPaymentDto;
}) => {
  return http.post(PAYMENTS_ENDPOINTS.PROCESS(bookingId), processPaymentDto);
};

type UseProcessPaymentOptions = {
  mutationConfig?: UseMutationOptions<unknown, unknown, ProcessPayment, unknown>;
};

export const useProcessPayment = ({ mutationConfig }: UseProcessPaymentOptions) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    onSuccess(data, variables, onMutateResult, context) {
      onSuccess?.(data, variables, onMutateResult, context);
    },
    ...restConfig,
    mutationFn: async (processPaymentData: ProcessPayment) => {
      const processPaymentDto = mapProcessPaymentToDto(processPaymentData);
      return processPayment({
        bookingId: processPaymentData.bookingId,
        processPaymentDto,
      });
    },
  });
};
