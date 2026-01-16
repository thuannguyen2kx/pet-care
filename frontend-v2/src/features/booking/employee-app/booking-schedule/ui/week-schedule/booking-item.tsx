import { getStatusConfig } from '@/features/booking/config/booking-status.config';
import type { Booking } from '@/features/booking/domain/booking.entity';
import { cn } from '@/shared/lib/utils';

export function BookingItem({
  booking,
  onViewDetail,
}: {
  booking: Booking;
  onViewDetail: (id: string) => void;
}) {
  const status = getStatusConfig(booking.status);

  return (
    <div
      className={cn(
        'bg-card hover:bg-muted/40 cursor-pointer rounded-md border-l-4 p-2',
        status.className,
      )}
      onClick={() => onViewDetail(booking.id)}
    >
      <p className="truncate text-xs font-medium">{booking.service.name}</p>

      <p className="text-muted-foreground truncate text-xs">
        {booking.pet?.name} · {booking.customer?.fullName}
      </p>

      <p className="text-muted-foreground text-[10px]">
        {booking.startTime} – {booking.endTime}
      </p>
    </div>
  );
}
