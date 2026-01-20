import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar, Clock, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router';

import { getStatusConfig } from '@/features/booking/config/booking-status.config';
import { BOOKING_STATUS, type Booking } from '@/features/booking/domain/booking.entity';
import { EmptyState } from '@/shared/components/template/empty-state';
import { SectionSpinner } from '@/shared/components/template/loading';
import { paths } from '@/shared/config/paths';
import { getInitials } from '@/shared/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

export type ListState =
  | { type: 'loading' }
  | { type: 'empty' }
  | { type: 'data'; bookings: Booking[] };

type Props = {
  state: ListState;
  onCancelBooking: (bookingId: string) => void;
};
export function BookingListContent({ state, onCancelBooking }: Props) {
  switch (state.type) {
    case 'loading':
      return <SectionSpinner />;
    case 'empty':
      return (
        <EmptyState
          title="Chưa có lịch hẹn nào"
          description="Đặt lịch ngay để chăm sóc thú cưng của bạn"
          icon={Calendar}
        />
      );
    case 'data':
      return <BookingList bookings={state.bookings} onCancelBooking={onCancelBooking} />;
  }
}

function BookingList({
  bookings,
  onCancelBooking,
}: {
  bookings: Booking[];
  onCancelBooking: (bookingId: string) => void;
}) {
  return (
    <ul className="flex flex-col gap-4">
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} onCancelBooking={onCancelBooking} />
      ))}
    </ul>
  );
}

function BookingCard({
  booking,
  onCancelBooking,
}: {
  booking: Booking;
  onCancelBooking: (bookingId: string) => void;
}) {
  const status = getStatusConfig(booking.status);
  return (
    <Card className="border-border/50 overflow-hidden rounded-none shadow-none">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          <div className="flex flex-1 gap-4 p-4">
            <Avatar className="h-14 w-14 rounded-xl">
              <AvatarImage src={booking.pet.image} className="object-cover" />
              <AvatarFallback>{getInitials(booking.pet.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-foreground font-semibold">{booking.service.name}</h3>
                  <p className="text-muted-foreground text-sm">cho {booking.pet.name}</p>
                </div>
                <Badge className={status.className}>{status.label}</Badge>
              </div>

              <div className="text-muted-foreground mt-3 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {format(booking.scheduledDate, 'dd/MM/yyyy', { locale: vi })}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {booking.startTime} - {booking.endTime}
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={booking.employee?.profilePicture?.url ?? undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(booking.employee.fullName)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{booking.employee.fullName}</span>
              </div>
            </div>
          </div>

          <div className="border-border/50 bg-secondary/30 flex items-center justify-between border-t p-4 sm:w-48 sm:flex-col sm:border-t-0 sm:border-l">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Tổng tiền</p>
              <p className="text-primary text-lg font-bold">{booking.totalAmount}</p>
            </div>
            {(booking.status === BOOKING_STATUS.PENDING ||
              booking.status === BOOKING_STATUS.CONFIRMED) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to={paths.customer.bookingDetail.getHref(booking.id)}>Xem chi tiết</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => onCancelBooking(booking.id)}
                  >
                    Hủy lịch hẹn
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
