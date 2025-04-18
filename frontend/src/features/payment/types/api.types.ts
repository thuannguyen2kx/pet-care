export type PaymentType = {
  _id: string;
  status: string;
  method: string;
  amount: number;
  transactionId: string;
  createdAt: string;
  refundData?: {
    amount: number;
    reason: string;
    processedAt: string;
  };
};

export type PaymentDetailType = {
  _id: string;
  appointmentId: {
    _id: string;
    scheduledDate: string;
    scheduledTimeSlot: {
      start: string;
      end: string;
    };
    serviceType: string;
    serviceId: {
      _id: string;
      name: string;
    };
  };
  customerId: {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  amount: number;
  currency: string;
  method: "card" | "cash" | "bank_transfer";
  status: "pending" | "completed" | "failed" | "refunded";
  transactionId: string;
  paymentProcessor: "stripe" | "offline";
  createdAt: string;
  updatedAt: string;
  refundData?: {
    amount: number;
    reason: string;
    processedAt: string;
  };
};

export type RefundPaymentParams = {
  paymentId: string;
  amount: number;
  reason: string;
}

type WeeklyRevenueItem = {
  day: string;
  amount: number;
  count: number;
};

type PaymentMethodStat = {
  name: string;
  value: number;
  amount: number;
};

type StatusCounts = {
  pending: number;
  completed: number;
  failed: number;
  refunded: number;
};

export type GetPaymentSummaryData = {
  monthlyRevenue: number;
  previousMonthRevenue: number;
  weeklyRevenue: WeeklyRevenueItem[];
  paymentsByMethod: PaymentMethodStat[];
  statusCounts: StatusCounts;
  todayPayments: number;
};
export type GetAdminPaymentsType = {
  payments: PaymentDetailType[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
};