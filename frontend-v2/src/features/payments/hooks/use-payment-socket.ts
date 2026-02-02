import { useEffect } from 'react';
import { toast } from 'sonner';

import { registerPaymentSocket } from '@/features/payments/socket/payment.socket';

export const usePaymentSocket = () => {
  useEffect(() => {
    return registerPaymentSocket({
      onPaymentPaid: () => {
        toast.info('Thanh toán dịch vụ thành công');
      },
    });
  }, []);
};
