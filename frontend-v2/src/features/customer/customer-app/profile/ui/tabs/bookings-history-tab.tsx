import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Link } from 'react-router';

import { getStatusConfig } from '@/features/booking/config/booking-status.config';
import type { Booking } from '@/features/booking/domain/booking.entity';
import { getCategoryConfig } from '@/features/service/constants';
import { paths } from '@/shared/config/paths';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';

type Props = {
  bookings: Booking[];
};
export function BookingsHistoryTab({ bookings }: Props) {
  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">Lịch sử đặt dịch vụ gần đây</p>
        <Button variant="ghost" size="sm" className="bg-transparent" asChild>
          <Link to={paths.customer.myBookings.path}>Xem tất cả</Link>
        </Button>
      </div>

      <div className="space-y-3">
        {bookings.map((booking) => {
          const bookingStatus = getStatusConfig(booking.status);
          const categoryConfig = getCategoryConfig(booking.service.category);
          return (
            <Link
              key={booking.id}
              to={paths.customer.bookingDetail.getHref(booking.id)}
              className="block"
            >
              <Card className="hover:border-primary rounded-none border border-transparent p-4 shadow-none transition-colors duration-300">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
                      <categoryConfig.icon className="text-primary h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium">{booking.service.name}</p>
                      <p className="text-muted-foreground text-sm">
                        {booking.pet.name} •{' '}
                        {format(booking.scheduledDate, 'dd/MM/yyyy', { locale: vi })} lúc{' '}
                        {booking.startTime}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={bookingStatus.className}>{bookingStatus.label}</Badge>
                    <p className="text-foreground mt-1 text-sm font-medium">
                      {booking.totalAmount}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </>
  );
}
