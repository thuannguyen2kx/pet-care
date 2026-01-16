import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar, Clock, MoreVertical } from 'lucide-react';

import { getStatusConfig } from '@/features/booking/config/booking-status.config';
import type { Booking } from '@/features/booking/domain/booking.entity';
import { getCategoryConfig } from '@/features/service/constants';
import { SectionSpinner } from '@/shared/components/template/loading';
import { getInitials } from '@/shared/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';

type Props = {
  bookings: Booking[];
  isLoading: boolean;
  onViewDetail: (bookingId: string) => void;
};

export function EmployeeBookingListContent({ bookings, isLoading, onViewDetail }: Props) {
  if (isLoading) {
    return <SectionSpinner />;
  }

  if (bookings.length === 0) {
    return (
      <Card className="rounded-none border-none p-4 shadow-none">
        <CardContent className="p-12 text-center">
          <Calendar className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <p className="text-muted-foreground">Không tìm thấy lịch hẹn nào</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="hidden lg:block">
        <div className="text-muted-foreground grid grid-cols-12 items-center gap-4 px-4 py-2 text-xs font-medium">
          <div className="col-span-3">Dịch vụ & Thú cưng</div>
          <div className="col-span-2">Khách hàng</div>
          <div className="col-span-2">Nhân viên</div>
          <div className="col-span-1">Ngày & Giờ</div>
          <div className="col-span-2 text-right">Tổng tiền</div>
          <div className="col-span-1 text-center">Trạng thái</div>
          <div className="col-span-1"></div>
        </div>
      </div>

      {bookings.map((booking) => {
        const bookingStatus = getStatusConfig(booking.status);
        const categoryConfig = getCategoryConfig(booking.service.category);

        return (
          <Card
            key={booking.id}
            className="rounded-none border-none shadow-none"
            onClick={() => onViewDetail(booking.id)}
          >
            <CardContent className="p-4">
              <div className="hidden lg:grid lg:grid-cols-12 lg:items-center lg:gap-4">
                <div className="col-span-3 flex min-w-0 items-center gap-3">
                  <div className="bg-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
                    <categoryConfig.icon className="text-primary h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-foreground truncate text-sm font-semibold">
                      {booking.service.name}
                    </h3>
                    <p className="text-muted-foreground truncate text-xs">
                      {booking.pet.name} ({booking.pet.breed})
                    </p>
                  </div>
                </div>

                <div className="col-span-2 flex min-w-0 items-center gap-2">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={booking.customer?.profilePicture?.url ?? undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {getInitials(booking.customer.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate text-sm font-medium">{booking.employee.fullName}</span>
                </div>

                <div className="col-span-2 flex min-w-0 items-center gap-2">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={booking.employee?.profilePicture?.url ?? undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {getInitials(booking.employee.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate text-sm font-medium">{booking.employee.fullName}</span>
                </div>

                <div className="col-span-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">
                      {format(booking.scheduledDate, 'dd/MM/yyyy', { locale: vi })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">
                      {booking.startTime} - {booking.endTime}
                    </span>
                  </div>
                </div>

                <div className="col-span-2 text-right">
                  <p className="text-primary text-sm font-semibold">
                    {booking.totalAmount.toLocaleString('vi-VN')}₫
                  </p>
                </div>

                <div className="col-span-1 flex justify-center">
                  <Badge className={`${bookingStatus.className} whitespace-nowrap`}>
                    {bookingStatus.label}
                  </Badge>
                </div>

                <div className="col-span-1 flex justify-end">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Tablet Layout (md-lg) */}
              <div className="hidden md:grid md:grid-cols-8 md:gap-4 lg:hidden">
                <div className="col-span-3 flex min-w-0 items-center gap-3">
                  <div className="bg-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
                    <categoryConfig.icon className="text-primary h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-foreground truncate text-sm font-semibold">
                      {booking.service.name}
                    </h3>
                    <p className="text-muted-foreground truncate text-xs">
                      {booking.pet.name} ({booking.pet.breed})
                    </p>
                  </div>
                </div>

                <div className="col-span-2 space-y-1 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="text-muted-foreground h-3.5 w-3.5" />
                    <span>{format(booking.scheduledDate, 'dd/MM/yyyy', { locale: vi })}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="text-muted-foreground h-3.5 w-3.5" />
                    <span>{booking.startTime}</span>
                  </div>
                </div>

                <div className="col-span-2 flex flex-col items-end justify-center gap-1">
                  <p className="text-primary text-sm font-semibold">
                    {booking.totalAmount.toLocaleString('vi-VN')}₫
                  </p>
                  <Badge className={`${bookingStatus.className}`}>{bookingStatus.label}</Badge>
                </div>

                <div className="col-span-1 flex items-center justify-end">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="flex flex-col gap-3 md:hidden">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="bg-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
                      <categoryConfig.icon className="text-primary h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-foreground text-sm font-semibold">
                        {booking.service.name}
                      </h3>
                      <p className="text-muted-foreground text-xs">
                        {booking.pet.name} ({booking.pet.breed})
                      </p>
                    </div>
                  </div>

                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>

                {/* Status & Amount */}
                <div className="flex items-center justify-between">
                  <Badge className={bookingStatus.className}>{bookingStatus.label}</Badge>
                  <p className="text-primary text-sm font-semibold">
                    {booking.totalAmount.toLocaleString('vi-VN')}₫
                  </p>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="text-muted-foreground h-4 w-4 shrink-0" />
                    <span>{format(booking.scheduledDate, 'dd/MM/yyyy', { locale: vi })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="text-muted-foreground h-4 w-4 shrink-0" />
                    <span>
                      {booking.startTime} - {booking.endTime}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <Avatar className="h-6 w-6 shrink-0">
                      <AvatarImage src={booking.employee?.profilePicture?.url ?? undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {getInitials(booking.employee.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate text-sm">{booking.employee.fullName}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
