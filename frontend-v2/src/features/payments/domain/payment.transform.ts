import type { ProcessPaymentDto } from '@/features/payments/domain/payment.dto';
import type { ProcessPayment } from '@/features/payments/payment.state';

export const mapProcessPaymentToDto = (state: ProcessPayment): ProcessPaymentDto => {
  return {
    paymentMethod: state.paymentMethod,
  };
};
