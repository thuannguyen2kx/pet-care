import { Download, Search } from 'lucide-react';

import { getStatusConfig } from '@/features/booking/config/booking-status.config';
import { BOOKING_VIEW_CONFIG } from '@/features/booking/config/booking-view.config';
import { BOOKING_STATUSES } from '@/features/booking/domain/booking.entity';
import type { BookingView, EmployeeBookingQuery } from '@/features/booking/domain/booking.state';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

type Props = {
  filter: EmployeeBookingQuery;
  onFilter: (next: Partial<EmployeeBookingQuery>) => void;
};

export function EmployeeBookingFilters({ filter, onFilter }: Props) {
  return (
    <div className="mb-6 space-y-4 p-4">
      {/* ================= VIEW TABS ================= */}
      <div className="bg-muted flex items-center gap-1 rounded-lg p-1">
        {Object.entries(BOOKING_VIEW_CONFIG).map(([view, config]) => {
          const Icon = config.icon;
          const active = filter.view === view;

          return (
            <button
              key={view}
              onClick={() =>
                onFilter({
                  view: view as BookingView,
                  startDate: undefined,
                  endDate: undefined,
                  page: 1,
                })
              }
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition',
                active
                  ? 'bg-background text-foreground shadow'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className="h-4 w-4" />
              {config.label}
            </button>
          );
        })}
      </div>

      {/* ================= DATE + ACTION ================= */}
      <div className="flex flex-col gap-4 p-2 md:flex-row">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input placeholder="Tìm theo tên khách hàng dịch vụ..." className="pl-10" />
        </div>
        <Input
          type="date"
          value={filter.startDate ?? ''}
          onChange={(e) =>
            onFilter({
              startDate: e.target.value,
              endDate: e.target.value,
              page: 1,
            })
          }
          className="w-44"
        />
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Xuất báo cáo
        </Button>
      </div>

      {/* ================= STATUS FILTER ================= */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground text-sm">Trạng thái:</span>

        <Button
          size="sm"
          variant={!filter.status ? 'secondary' : 'ghost'}
          onClick={() => onFilter({ status: undefined, page: 1 })}
        >
          Tất cả
        </Button>

        {BOOKING_STATUSES.map((status) => {
          const opt = getStatusConfig(status);
          const active = filter.status === status;

          return (
            <Button
              key={status}
              size="sm"
              variant={active ? 'secondary' : 'ghost'}
              onClick={() => onFilter({ status, page: 1 })}
            >
              {opt.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
