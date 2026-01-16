import { useState } from 'react';

import { useEmployeeBooking } from '@/features/booking/api/get-booking';

export const useEmployeeBookingDetailDialog = () => {
  const [bookingId, setBookingId] = useState<string | null>(null);

  const isOpen = !!bookingId;

  const bookingQuery = useEmployeeBooking({
    bookingId: bookingId!,
    queryConfig: {
      enabled: isOpen,
    },
  });

  const open = (id: string) => setBookingId(id);
  const close = () => setBookingId(null);

  const onOpenChange = (open: boolean) => {
    if (!open) close();
  };

  return {
    state: {
      isOpen,
      isLoading: bookingQuery.isLoading,
    },
    data: {
      booking: bookingQuery.data,
    },
    actions: {
      open,
      close,
      onOpenChange,
    },
  };
};
