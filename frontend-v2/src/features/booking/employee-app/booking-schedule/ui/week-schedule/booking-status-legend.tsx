import { BOOKING_STATUS_CONFIG } from '@/features/booking/config/booking-status.config';
import { BOOKING_STATUSES } from '@/features/booking/domain/booking.entity';

export function BookingStatusLegend() {
  return (
    <div className="flex flex-wrap justify-end gap-3 text-xs">
      {BOOKING_STATUSES.map((status) => {
        const config = BOOKING_STATUS_CONFIG[status];

        return (
          <div key={status} className="flex items-center gap-1.5">
            <span className={`size-4 rounded-full border ${config.className}`} />
            <span className="text-muted-foreground">{config.label}</span>
          </div>
        );
      })}
    </div>
  );
}
