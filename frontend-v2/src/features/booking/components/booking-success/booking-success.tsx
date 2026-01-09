import { ChevronLeftIcon } from 'lucide-react';
import { Link } from 'react-router';

import { paths } from '@/shared/config/paths';
import { Button } from '@/shared/ui/button';

export function CreatBookingSuccess() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="h-36">
          <img src="/illustration/success.svg" alt="Success" className="h-full w-full" />
        </div>
        <h5 className="text-xl font-bold text-gray-800">Lịch đặt của bạn đã hoàn tất</h5>
        <div className="text-gray-600">Bạn sẽ được nhận email xác nhận với chi tiết lịch đặt</div>

        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to={paths.customer.booking.path}>
              <ChevronLeftIcon className="size-5" />
              Tiếp tục đặt lịch
            </Link>
          </Button>
          <Button asChild>
            <Link to={paths.customer.myBookings.path}>Quản lý lịch đặt</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
