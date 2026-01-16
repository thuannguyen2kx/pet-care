import { Calendar } from 'lucide-react';

import type { BookingDetail, BookingStatus } from '@/features/booking/domain/booking.entity';
import type { UpdateBookingStatus } from '@/features/booking/domain/booking.state';
import { EmployeeBookingDetailContent } from '@/features/booking/employee-app/booking-list/dialog/booking-detail/booking-detail-content';
import { EmptyState } from '@/shared/components/template/empty-state';
import { SectionSpinner } from '@/shared/components/template/loading';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { ScrollArea } from '@/shared/ui/scroll-area';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking?: BookingDetail;
  isLoading: boolean;
  onUpdateBookingStatus: (
    bookingId: string,
    status: BookingStatus,
    nextStatus: UpdateBookingStatus['status'],
  ) => void;
  onCancelBooking: (bookingId: string) => void;
};

export function EmployeeBookingDetailDialog({
  open,
  onOpenChange,
  booking,
  isLoading,
  onUpdateBookingStatus,
  onCancelBooking,
}: Props) {
  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chi tiết đặt lịch</DialogTitle>
            <DialogDescription>Xem và quản lý thông tin đặt lịch dịch vụ</DialogDescription>
          </DialogHeader>
          <SectionSpinner />
        </DialogContent>
      </Dialog>
    );
  }

  if (!booking) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chi tiết đặt lịch</DialogTitle>
            <DialogDescription>Xem và quản lý thông tin đặt lịch dịch vụ</DialogDescription>
          </DialogHeader>
          <EmptyState
            title="Không tìm thấy thông tin"
            description="Thông tin lịch đặt không tồn tại hoặc có thể được bị xoá. Vui lòng thử lại sau"
            icon={Calendar}
          />
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chi tiết đặt lịch</DialogTitle>
          <DialogDescription>Xem và quản lý thông tin đặt lịch dịch vụ</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <EmployeeBookingDetailContent
            booking={booking}
            onUpdateBookingStatus={onUpdateBookingStatus}
            onCancelBooking={onCancelBooking}
          />
        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Đóng</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
