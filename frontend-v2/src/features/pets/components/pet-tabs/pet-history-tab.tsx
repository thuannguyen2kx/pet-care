import { Calendar, Check } from 'lucide-react';

import { formatDateVN } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent } from '@/shared/ui/card';

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  petBookings: any[];
};
export function PetHistoryTab({ petBookings }: Props) {
  return (
    <>
      <div className="space-y-3">
        {petBookings.map((booking) => (
          <Card key={booking.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                    booking.status === 'completed'
                      ? 'bg-primary/10'
                      : booking.status === 'confirmed'
                        ? 'bg-accent'
                        : 'bg-muted'
                  }`}
                >
                  {booking.status === 'completed' ? (
                    <Check className="text-primary h-6 w-6" />
                  ) : (
                    <Calendar
                      className={`h-6 w-6 ${
                        booking.status === 'confirmed'
                          ? 'text-accent-foreground'
                          : 'text-muted-foreground'
                      }`}
                    />
                  )}
                </div>
                <div>
                  <p className="text-foreground font-medium">{booking.service}</p>
                  <p className="text-muted-foreground text-sm">
                    {formatDateVN(new Date(booking.date))} lúc {booking.time}
                    {booking.staff && ` • ${booking.staff}`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge
                  variant={
                    booking.status === 'completed'
                      ? 'default'
                      : booking.status === 'confirmed'
                        ? 'secondary'
                        : 'outline'
                  }
                >
                  {booking.status === 'completed'
                    ? 'Hoàn thành'
                    : booking.status === 'confirmed'
                      ? 'Đã xác nhận'
                      : 'Chờ xác nhận'}
                </Badge>
                <p className="text-foreground mt-1 text-sm font-medium">
                  {/* {formatCurrency(booking.price)} */}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
