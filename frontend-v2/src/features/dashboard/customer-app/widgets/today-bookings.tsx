import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

import { useBookings } from '@/features/booking/api/get-bookings';
import { getStatusConfig } from '@/features/booking/config/booking-status.config';
import { BOOKING_VIEW } from '@/features/booking/domain/booking.state';
import { getServiceCategoryConfig } from '@/features/service/config';
import { paths } from '@/shared/config/paths';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

export function TodayBookingsWidget() {
  const todayBookingsQuery = useBookings({
    query: {
      page: 1,
      limit: 3,
      view: BOOKING_VIEW.TODAY,
    },
  });

  if (todayBookingsQuery.isLoading) {
    return null;
  }

  const bookings = todayBookingsQuery.data?.bookings ?? [];

  if (bookings.length === 0) {
    return (
      <Card className="bg-muted/30 border-dashed shadow-none">
        <CardContent className="py-6 text-center">
          <p className="text-muted-foreground text-sm">🎉 Hôm nay bạn không có lịch hẹn nào</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/30 bg-primary/5 p-4 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">📅 Lịch hẹn hôm nay</CardTitle>
        <Link to={paths.customer.myBookings.path}>
          <Button variant="ghost" size="sm" className="text-primary gap-1">
            Xem tất cả
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="space-y-4">
        {bookings.map((booking) => {
          const status = getStatusConfig(booking.status);
          const category = getServiceCategoryConfig(booking.service.category);

          return (
            <div
              key={booking.id}
              className="bg-background border-border flex gap-4 rounded-xl border p-4"
            >
              <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
                <category.icon className="text-primary h-6 w-6" />
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{booking.service.name}</p>
                    <p className="text-muted-foreground text-sm">Cho bé {booking.pet.name}</p>
                  </div>
                  <Badge className={status.className}>{status.label}</Badge>
                </div>

                <div className="text-muted-foreground flex gap-4 text-sm">
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
      </CardContent>
    </Card>
  );
}
