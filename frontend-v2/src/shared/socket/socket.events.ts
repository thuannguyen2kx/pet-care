export const SOCKET_EVENTS = {
  BOOKING: {
    CREATED: 'booking:created',
    STATUS_CHANGED: 'booking:status:changed',
  },
  NOTIFICATION: {
    NEW: 'notification:new',
  },
  PAYMENT: {
    PAID: 'payment:paid',
  },
} as const;
