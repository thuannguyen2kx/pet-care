export const PaymentMethodEnum = {
  CASH: "cash",
  CARD: "card",
};
export type PaymentMethodType =
  (typeof PaymentMethodEnum)[keyof typeof PaymentMethodEnum];
export const PaymentStatusEnum = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;
export type PaymentStatusType =
  (typeof PaymentStatusEnum)[keyof typeof PaymentStatusEnum];

export const PaymentProcessorEnum = {
  STRIPE: "stripe",
  OFFLINE: "offline",
};
export type PaymentProcessorType =
  (typeof PaymentProcessorEnum)[keyof typeof PaymentProcessorEnum];
