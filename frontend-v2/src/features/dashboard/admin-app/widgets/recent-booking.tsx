import { ArrowRight, Badge, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router';

import { useAdminBookings } from '@/features/booking/api/get-bookings';
import { getStatusConfig } from '@/features/booking/config/booking-status.config';
import type { Booking } from '@/features/booking/domain/booking.entity';
import { BOOKING_VIEW } from '@/features/booking/domain/booking.state';
import { getCategoryConfig } from '@/features/service/constants';
import { paths } from '@/shared/config/paths';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

export function AdminRecentBooking() {
  const bookingsQuery = useAdminBookings({
    query: {
      page: 1,
      limit: 10,
      view: BOOKING_VIEW.UPCOMMING,
    },
  });

  return (
    <Card className="rounded-none border-none p-4 shadow-none lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">Lịch hẹn gần đây</CardTitle>
          <CardDescription>Các lịch hẹn mới nhất của cửa hàng</CardDescription>
        </div>
        <Link to={paths.admin.bookings.path}>
          <Button variant="ghost" size="sm" className="text-primary">
            Xem tất cả <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <RecentBookingList
          bookings={bookingsQuery.data?.bookings ?? []}
          isLoading={bookingsQuery.isLoading}
        />
      </CardContent>
    </Card>
  );
}

function RecentBookingList({ bookings, isLoading }: { bookings: Booking[]; isLoading: boolean }) {
  if (isLoading) {
    return <RecentBookingListSkeleton />;
  }
  if (!bookings.length) {
    return <RecentBookingEmpty />;
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <RecentBookingItem key={booking.id} booking={booking} />
      ))}
    </div>
  );
}

function RecentBookingItem({ booking }: { booking: Booking }) {
  const bookingStatus = getStatusConfig(booking.status);
  const categoryConfig = getCategoryConfig(booking.service.category);
  return (
    <div
      key={booking.id}
      className="bg-muted/30 hover:bg-muted/50 flex items-center gap-4 rounded-xl p-4 transition-colors"
    >
      <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
        <categoryConfig.icon className="text-primary h-5 w-5" />
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

function RecentBookingEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="bg-muted mb-3 flex h-14 w-14 items-center justify-center rounded-full">
        <Calendar className="text-muted-foreground h-7 w-7" />
      </div>
      <p className="text-muted-foreground">Không có lịch hẹn gần đây</p>
    </div>
  );
}
export function RecentBookingListSkeleton({ count = 5 }: { count?: number } = {}) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <RecentBookingItemSkeleton key={i} />
      ))}
    </div>
  );
}

export function RecentBookingItemSkeleton() {
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
