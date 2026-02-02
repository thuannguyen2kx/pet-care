import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

import { StripeCheckoutResponseSchema } from '@/features/payments/domain/payment-http-schema';
import type { CreateStripeCheckoutDto } from '@/features/payments/domain/payment.dto';
import { PAYMENTS_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';

const createStripeCheckout = (createStripeCheckout: CreateStripeCheckoutDto) => {
  return http.post(PAYMENTS_ENDPOINTS.STRIPE_CHECKOUT, createStripeCheckout);
};

type UseCreateStripeCheckoutOptions = {
  mutationConfig?: UseMutationOptions<{ url: string }, unknown, CreateStripeCheckoutDto, unknown>;
};

export const useCreateStripeCheckout = ({
  mutationConfig,
}: UseCreateStripeCheckoutOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    onSuccess(data, variables, onMutateResult, context) {
      onSuccess?.(data, variables, onMutateResult, context);
    },
    ...restConfig,
    mutationFn: async (createStripeCheckoutData: CreateStripeCheckoutDto) => {
      const raw = await createStripeCheckout(createStripeCheckoutData);
      const response = StripeCheckoutResponseSchema.parse(raw);
      return {
        url: response.data.url,
      };
    },
  });
};
