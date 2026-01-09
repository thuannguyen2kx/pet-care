export const bookingQueryKey = {
  LIST: 'bookings',
  DETAIL: (bookingId: string) => ['bookings', bookingId],
  CANCEL: (bookingId: string) => ['bookings', bookingId, 'cancel'],
  UPDATE_STATUS: (bookingId: string) => ['bookings', bookingId, 'status'],
  ADD_RATING: (bookingId: string) => ['bookings', bookingId, 'rating'],
  ADD_REVIEW: (bookingId: string) => ['bookings', bookingId, 'review'],
  UPDATE_REVIEW: (bookingId: string) => ['bookings', bookingId, 'review'],
  AVAILABILITY: 'availability',
  avaibilitySlots: (query: { employeeId: string; date: string; serviceId: string }) => [
    'availability',
    'slots',
    query,
  ],
  avaibilityEmployees: (query: { serviceId: string }) => ['availability', 'employees', query],
};
