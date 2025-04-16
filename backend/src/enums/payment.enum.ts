export const PaymentMethodEnum = {
  CASH: 'cash',
  CARD: 'card',
  BANK_TRANSFER: 'bank_transfer'
};
export type PaymentMethodType = typeof PaymentMethodEnum[keyof typeof PaymentMethodEnum];
export const PaymentStatusEnum = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};
export type PaymentStatusType = typeof PaymentStatusEnum[keyof typeof PaymentStatusEnum];

export const PaymentProcessorEnum = {
  STRIPE: 'stripe',
  OFFLINE: 'offline',
}
export type PaymentProcessorType = typeof PaymentProcessorEnum[keyof typeof PaymentProcessorEnum];