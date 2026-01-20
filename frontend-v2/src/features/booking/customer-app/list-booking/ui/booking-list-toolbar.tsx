import { BOOKING_VIEW_CONFIG } from '@/features/booking/config';
import type { CustomerBookingQuery } from '@/features/booking/domain/booking.state';
import { Button } from '@/shared/ui/button';

type Props = {
  filter: CustomerBookingQuery;
  onFilter: (next: Partial<CustomerBookingQuery>) => void;
};
export function BookingListToolbar({ filter, onFilter }: Props) {
  return (
    <div className="mb-6 flex gap-2">
      {Object.entries(BOOKING_VIEW_CONFIG).map(([view, config]) => {
        return (
          <Button
            key={view}
            variant={filter.view === view ? 'default' : 'outline'}
            onClick={() => onFilter({ view: view as CustomerBookingQuery['view'] })}
          >
            {config.label}
          </Button>
        );
      })}
    </div>
  );
}
