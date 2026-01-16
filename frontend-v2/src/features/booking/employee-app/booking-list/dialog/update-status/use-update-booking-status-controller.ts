import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useEmployeeUpdateBookingStatus } from '@/features/booking/api/update-booking-status';
import type { BookingStatus } from '@/features/booking/domain/booking.entity';
import { BOOKING_STATUS_TRANSITIONS } from '@/features/booking/domain/booking.policy';
import {
  updateBookingStatusSchema,
  type UpdateBookingStatus,
} from '@/features/booking/domain/booking.state';

export const useEmployeeUpdateBookingStatusController = () => {
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState<BookingStatus | null>(null);

  const isOpen = Boolean(selectedBookingId);

  const openUpdateBookingStatusDialog = (
    bookingId: string,
    status: BookingStatus,
    nextStatus: UpdateBookingStatus['status'],
  ) => {
    setSelectedBookingId(bookingId);
    setCurrentStatus(status);
    form.reset({ bookingId, status: nextStatus });
  };

  const closeUpdateBookingStatusDialog = () => {
    setSelectedBookingId(null);
    setCurrentStatus(null);
    form.reset();
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      closeUpdateBookingStatusDialog();
    }
  };

  const allowedStatuses = useMemo(() => {
    if (!currentStatus) return [];
    return BOOKING_STATUS_TRANSITIONS[currentStatus] ?? [];
  }, [currentStatus]);

  const form = useForm<UpdateBookingStatus>({
    resolver: zodResolver(updateBookingStatusSchema),
    defaultValues: {
      bookingId: undefined,
      status: undefined,
      reason: '',
      employeeNotes: '',
    },
  });

  const updateStatusMutation = useEmployeeUpdateBookingStatus({
    mutationOptions: {
      onSuccess: () => {
        form.reset();
        toast.success('Đã cập nhật trạng thái đặt lịch');
        closeUpdateBookingStatusDialog();
      },
    },
  });

  const submitUpdateBookingStatus = form.handleSubmit((values) => {
    updateStatusMutation.mutate(values);
  });

  return {
    state: {
      isOpen,

      isStatusSelectable: allowedStatuses.length > 0,
      isSubmitting: updateStatusMutation.isPending,
    },
    form,
    data: {
      allowedStatuses,
    },
    actions: {
      openUpdateBookingStatusDialog,
      closeUpdateBookingStatusDialog,
      onOpenChange,
      submitUpdateBookingStatus,
    },
  };
};
