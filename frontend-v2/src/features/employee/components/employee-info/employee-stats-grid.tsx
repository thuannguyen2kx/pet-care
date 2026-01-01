import { Calendar, DollarSign, Star } from 'lucide-react';

import type { TProfile } from '@/features/user/types';

type Props = {
  employeeInfo: TProfile['employeeInfo'];
};
export function EmployeeStatsGrid({ employeeInfo }: Props) {
  return (
    <div className="grid w-full grid-cols-3 gap-4">
      <div className="text-center">
        <div className="text-warning mb-1 flex items-center justify-center gap-1">
          <Star className="h-4 w-4 fill-current" />
          <span className="text-foreground text-lg font-bold">{employeeInfo?.stats.rating}</span>
        </div>
        <span className="text-muted-foreground text-xs">Đánh giá</span>
      </div>
      <div className="text-center">
        <div className="mb-1 flex items-center justify-center gap-1">
          <Calendar className="text-primary h-4 w-4" />
          <span className="text-foreground text-lg font-bold">
            {employeeInfo?.stats.completedBookings}
          </span>
        </div>
        <span className="text-muted-foreground text-xs">Dịch vụ</span>
      </div>
      <div className="text-center">
        <div className="mb-1 flex items-center justify-center gap-1">
          <DollarSign className="text-success h-4 w-4" />
          <span className="text-foreground text-lg font-bold">
            {((employeeInfo?.stats.totalRevenue || 0) / 1000000).toFixed(0)}M
          </span>
        </div>
        <span className="text-muted-foreground text-xs">Doanh thu</span>
      </div>
    </div>
  );
}
