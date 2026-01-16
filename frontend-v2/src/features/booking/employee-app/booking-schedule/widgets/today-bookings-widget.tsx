import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar, Clock } from 'lucide-react';

import { getStatusConfig } from '@/features/booking/config/booking-status.config';
import type { Booking } from '@/features/booking/domain/booking.entity';
import { useEmployeeBookingList } from '@/features/booking/employee-app/booking-schedule/application/use-today-booking-list';
import { EmployeeTodayBookingListPagination } from '@/features/booking/employee-app/booking-schedule/ui/today-bookings/booking-list-pagination';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

type Props = {
  onViewDetail: (bookingId: string) => void;
};
export function EmployeeTodayBookingsWidget({ onViewDetail }: Props) {
  const bookingCtrl = useEmployeeBookingList();

  const sortedBookings = [...bookingCtrl.data].sort((a, b) =>
    a.startTime.localeCompare(b.startTime),
  );

  return (
    <>
      <Card className="rounded-none border-none p-4 shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="text-primary h-5 w-5" />
            Lịch hẹn hôm nay
          </CardTitle>
          <CardDescription>
            {format(new Date('2011-11-11'), 'EEEE dd/MM/yyyy', { locale: vi })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TodayBookingList
            isLoading={bookingCtrl.isLoading}
            bookings={sortedBookings}
            onViewDetail={onViewDetail}
          />
        </CardContent>
      </Card>

      <EmployeeTodayBookingListPagination
        page={bookingCtrl.pagination?.page ?? 1}
        totalPages={bookingCtrl.pagination?.totalPages ?? 1}
        onPageChange={(page) => bookingCtrl.setFilters({ page })}
      />
    </>
  );
}

export function TodayBookingList({
  bookings,
  isLoading,
  onViewDetail,
}: {
  bookings: Booking[];
  isLoading: boolean;
  onViewDetail: (bookingId: string) => void;
}) {
  if (isLoading) {
    return <TodayBookingListSkeleton />;
  }
  if (!bookings.length) {
    return <TodayBookingEmpty />;
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <TodayBookingItem key={booking.id} booking={booking} onViewDetail={onViewDetail} />
      ))}
    </div>
  );
}
export function TodayBookingItem({
  booking,
  onViewDetail,
}: {
  booking: Booking;
  onViewDetail: (bookingId: string) => void;
}) {
  const status = getStatusConfig(booking.status);

  return (
    <div
      className={`bg-muted/30 flex items-center gap-4 rounded-xl border-l-4 p-4 ${status.className}`}
      onClick={() => onViewDetail(booking.id)}
    >
      <div className="min-w-16 text-center">
        <p className="text-primary text-lg font-bold">{booking.startTime}</p>
        <p className="text-muted-foreground text-xs">{booking.endTime}</p>
      </div>

      <div className="flex-1">
        <h4 className="font-semibold">{booking.service.name}</h4>
        <div className="mt-1 flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={booking.pet.image} />
            <AvatarFallback className="bg-secondary text-xs">{booking.pet.name[0]}</AvatarFallback>
          </Avatar>
          <span className="text-muted-foreground text-sm">
            {booking.pet.name} ({booking.pet.breed})
          </span>
        </div>
      </div>

      <Badge className={status.className}>{status.label}</Badge>

      <div className="text-right">
        <p className="text-primary font-semibold">{booking.totalAmount}</p>
      </div>
    </div>
  );
}
function TodayBookingEmpty() {
  return (
    <div className="text-muted-foreground py-12 text-center">
      <Calendar className="mx-auto mb-3 h-12 w-12 opacity-50" />
      <p>Không có lịch hẹn nào hôm nay</p>
    </div>
  );
}

function TodayBookingListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <TodayBookingItemSkeleton key={i} />
      ))}
    </div>
  );
}

export function TodayBookingItemSkeleton() {
  return (
    <div className="bg-muted/30 flex items-center gap-4 rounded-xl border-l-4 border-gray-200 p-4">
      <div className="min-w-16 text-center">
        <Skeleton className="mx-auto mb-1 h-6 w-14" />
        <Skeleton className="mx-auto h-3 w-12" />
      </div>

      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-48" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-36" />
        </div>
      </div>

      <Skeleton className="h-6 w-24 rounded-full" />

      <div className="text-right">
        <Skeleton className="ml-auto h-5 w-20" />
      </div>
    </div>
  );
}
