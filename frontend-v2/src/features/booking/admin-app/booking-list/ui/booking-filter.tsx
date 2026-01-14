import { Download, Search } from 'lucide-react';

import { getStatusConfig } from '@/features/booking/config/booking-status.config';
import { BOOKING_STATUSES } from '@/features/booking/domain/booking.entity';
import type { AdminBookingQuery } from '@/features/booking/domain/booking.state';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';

type Props = {
  filter: AdminBookingQuery;
  onFilter: (next: Partial<AdminBookingQuery>) => void;
};
export function AdminBookingFilters({ filter, onFilter }: Props) {
  return (
    <>
      <Card className="mb-6 rounded-none border-0 border-none shadow-none">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input placeholder="Tìm theo tên nhân viên, dịch vụ..." className="pl-10" />
            </div>
            <Input
              type="date"
              value={filter.startDate ?? undefined}
              onChange={(e) => onFilter({ startDate: e.target.value, page: 1 })}
              className="w-full md:w-44"
            />
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Xuất báo cáo
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="mb-6 flex justify-end gap-2">
        <Button
          variant={!filter.status ? 'default' : 'outline'}
          onClick={() => onFilter({ status: undefined, page: 1 })}
        >
          Tất cả
        </Button>

        {BOOKING_STATUSES.map((status) => {
          const opt = getStatusConfig(status);
          return (
            <Button
              key={status}
              variant={filter.status === status ? 'default' : 'outline'}
              onClick={() => onFilter({ status, page: 1 })}
            >
              {opt.label}
            </Button>
          );
        })}
      </div>
    </>
  );
}
