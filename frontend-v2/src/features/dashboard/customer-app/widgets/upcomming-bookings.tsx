import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router';

import { useBookings } from '@/features/booking/api/get-bookings';
import { getStatusConfig } from '@/features/booking/config/booking-status.config';
import type { Booking } from '@/features/booking/domain/booking.entity';
import { BOOKING_VIEW } from '@/features/booking/domain/booking.state';
import { getServiceCategoryConfig } from '@/features/service/config';
import { paths } from '@/shared/config/paths';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

type Props = {
  bookings?: Booking[];
};

export function UpcommingBookingsWidget({ bookings }: Props) {
  const upcommingBookingsQuery = useBookings({
    query: {
      page: 1,
      limit: 10,
      view: BOOKING_VIEW.UPCOMMING,
    },
    queryConfig: {
      enabled: !bookings,
    },
  });

  if (upcommingBookingsQuery.isLoading) {
    return <UpcommingBookingsSkeleton />;
  }

  const bookingsData = bookings || upcommingBookingsQuery.data?.bookings || [];

  return (
    <Card className="border-none p-6 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Lịch hẹn sắp tới</CardTitle>
        <Link to={paths.customer.myBookings.path}>
          <Button variant="ghost" size="sm" className="text-primary gap-1">
            Xem tất cả
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {bookingsData.map((booking) => {
          const bookingStatus = getStatusConfig(booking.status);
          const categoryConfig = getServiceCategoryConfig(booking.service.category);
          return (
            <div key={booking.id} className="border-border flex gap-4 rounded-xl border p-4">
              <div className="bg-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
                <categoryConfig.icon className="text-primary h-6 w-6" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-foreground font-medium">{booking.service.name}</p>
                    <p className="text-muted-foreground text-sm">Cho bé {booking.pet.name}</p>
                  </div>
                  <Badge className={bookingStatus.className}>{bookingStatus.label}</Badge>
                </div>
                <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {format(booking.scheduledDate, 'dd/MM/yyyy', { locale: vi })}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {booking.startTime}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {bookingsData.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">Bạn chưa có lịch hẹn nào</p>
            <Button className="mt-4" asChild>
              <Link to={paths.customer.booking.path}>Đặt lịch ngay</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
function UpcommingBookingsSkeleton() {
  return (
    <Card className="border-none p-6 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Lịch hẹn sắp tới</CardTitle>
        <Button variant="ghost" size="sm" className="text-primary gap-1" disabled>
          Xem tất cả
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="border-border flex gap-4 rounded-xl border p-4">
            <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />

            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>

              <div className="flex flex-wrap gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
