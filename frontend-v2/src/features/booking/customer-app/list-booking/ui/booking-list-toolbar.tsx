import { getStatusConfig } from '@/features/booking/config/booking-status.config';
import { BOOKING_STATUSES } from '@/features/booking/domain/booking.entity';
import type { CustomerBookingQuery } from '@/features/booking/domain/booking.state';
import { Button } from '@/shared/ui/button';

type Props = {
  filter: CustomerBookingQuery;
  onFilter: (next: Partial<CustomerBookingQuery>) => void;
};
export function BookingListToolbar({ filter, onFilter }: Props) {
  return (
    <div className="mb-6 flex gap-2">
      <Button
        variant={!filter.status ? 'default' : 'outline'}
        onClick={() => onFilter({ status: undefined })}
      >
        Tất cả
      </Button>

      {BOOKING_STATUSES.map((status) => {
        const opt = getStatusConfig(status);
        return (
          <Button
            key={status}
            variant={filter.status === status ? 'default' : 'outline'}
            onClick={() => onFilter({ status })}
          >
            {opt.label}
          </Button>
        );
      })}
    </div>
  );
}
