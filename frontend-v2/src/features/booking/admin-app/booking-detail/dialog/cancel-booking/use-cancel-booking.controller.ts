import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useAdminCancelBooking } from '@/features/booking/api/cancel-booking';
import { cancelBookingSchema, type CancelBooking } from '@/features/booking/domain/booking.state';

export const useAdminCancelBookingController = () => {
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const form = useForm<CancelBooking>({
    resolver: zodResolver(cancelBookingSchema),
    defaultValues: {
      bookingId: '',
      reason: '',
    },
  });
  const isOpen = Boolean(selectedBookingId);

  const cancelBookingMutation = useAdminCancelBooking();

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
        toast.success('Đã huỷ lịch hẹn thành công');
        form.reset();
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
