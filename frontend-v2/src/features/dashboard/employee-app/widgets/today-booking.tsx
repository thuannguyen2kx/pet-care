import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router';

import { useEmployeeBookings } from '@/features/booking/api/get-bookings';
import { getStatusConfig } from '@/features/booking/config/booking-status.config';
import type { Booking } from '@/features/booking/domain/booking.entity';
import { BOOKING_VIEW } from '@/features/booking/domain/booking.state';
import { paths } from '@/shared/config/paths';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

export function EmployeeTodayBookingDashboard() {
  const bookingsQuery = useEmployeeBookings({
    query: {
      page: 1,
      limit: 10,
      view: BOOKING_VIEW.TODAY,
    },
  });
  const sortedBookings = [...(bookingsQuery.data?.bookings ?? [])].sort((a, b) =>
    a.startTime.localeCompare(b.startTime),
  );

  return (
    <Card className="rounded-none border-none p-4 shadow-none lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">Lịch hẹn hôm nay</CardTitle>
          <CardDescription>Các lịch hẹn cần thực hiện</CardDescription>
        </div>
        <Link to={paths.employee.bookings.path}>
          <Button variant="ghost" size="sm" className="text-primary">
            Xem tất cả <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>

      <CardContent>
        <TodayBookingList bookings={sortedBookings} isLoading={bookingsQuery.isLoading} />
      </CardContent>
    </Card>
  );
}
export function TodayBookingList({
  bookings,
  isLoading,
}: {
  bookings: Booking[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return <TodayBookingListSkeleton />;
  }
  if (!bookings.length) {
    return <TodayBookingEmpty />;
  }

  return (
    <div className="space-y-3">
      {bookings.map((booking) => (
        <TodayBookingItem key={booking.id} booking={booking} />
      ))}
    </div>
  );
}

function TodayBookingItem({ booking }: { booking: Booking }) {
  const bookingStatus = getStatusConfig(booking.status);
  return (
    <div
      key={booking.id}
      className="bg-muted/30 hover:bg-muted/50 flex items-center gap-4 rounded-xl p-4 transition-colors"
    >
      <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
        <Clock className="text-primary h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-foreground font-medium">{booking.service?.name}</p>
        <p className="text-muted-foreground text-sm">
          {booking.startTime} - {booking.endTime}
        </p>
      </div>
      <Badge className={bookingStatus.className}>{bookingStatus.label}</Badge>
    </div>
  );
}

function TodayBookingEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="bg-muted mb-3 flex h-14 w-14 items-center justify-center rounded-full">
        <Calendar className="text-muted-foreground h-7 w-7" />
      </div>
      <p className="text-muted-foreground">Không có lịch hẹn hôm nay</p>
    </div>
  );
}
export function TodayBookingListSkeleton({ count = 5 }: { count?: number } = {}) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <TodayBookingItemSkeleton key={i} />
      ))}
    </div>
  );
}

export function TodayBookingItemSkeleton() {
  return (
    <div className="bg-muted/30 flex items-center gap-4 rounded-xl p-4">
      <Skeleton className="h-12 w-12 rounded-xl" />

      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-32" />
      </div>

      <Skeleton className="h-6 w-24 rounded-full" />
    </div>
  );
}
