import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useCancelBooking } from '@/features/booking/api/cancel-booking';
import { cancelBookingSchema, type CancelBooking } from '@/features/booking/domain/booking.state';

export const useCancelBookingController = () => {
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const form = useForm<CancelBooking>({
    resolver: zodResolver(cancelBookingSchema),
    defaultValues: {
      bookingId: '',
      reason: '',
    },
  });
  const isOpen = Boolean(selectedBookingId);

  const cancelBookingMutation = useCancelBooking();

  const openCancelDialog = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    form.reset({ bookingId, reason: '' });
  };
  const closeCancelDialog = () => {
    setSelectedBookingId(null);
    form.reset();
  };
  const onOpenChange = (open: boolean) => {
    if (!open) {
      closeCancelDialog();
    }
  };
  const submitCancelBooking = form.handleSubmit((data) => {
    cancelBookingMutation.mutate(data, {
      onSuccess: () => {
        closeCancelDialog();
      },
    });
  });

  return {
    state: {
      isOpen,
      bookingId: selectedBookingId,
      isSubmitting: cancelBookingMutation.isPending,
    },
    form,
    actions: {
      openCancelDialog,
      onOpenChange,
      submitCancelBooking,
    },
  };
};
