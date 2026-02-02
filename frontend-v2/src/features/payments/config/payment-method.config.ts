import { CreditCard, Store } from 'lucide-react';
import type { ElementType } from 'react';

import type { PaymentMethod } from '@/features/payments/domain/payment.entity';

type PaymentMethodConfig = {
  id: string;
  name: string;
  description: string;
  icon: ElementType;
};

export const PAYMENT_METHODS_CONFIG: Record<PaymentMethod, PaymentMethodConfig> = {
  cash: {
    id: 'cash',
    name: 'Thanh toán tại cửa hàng',
    description: 'Trả tiền khi đến cửa hàng',
    icon: Store,
  },
  card: {
    id: 'card',
    name: 'Thanh toán online',
    description: 'Visa / Mastercard / Stripe',
    icon: CreditCard,
  },
};

export const getPaymentMethodConfig = (method: PaymentMethod) => PAYMENT_METHODS_CONFIG[method];

export const formatPaymentMethod = (method: PaymentMethod) => getPaymentMethodConfig(method).name;
