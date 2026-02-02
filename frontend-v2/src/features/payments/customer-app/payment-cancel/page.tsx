import { AlertCircle } from 'lucide-react';
import { Link, useSearchParams } from 'react-router';

import { paths } from '@/shared/config/paths';
import { Button } from '@/shared/ui/button';

export default function PaymentCancelPage() {
  const [searchParams] = useSearchParams();

  const bookingId = searchParams.get('booking_id');
  return (
    <div className="bg-background flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl">
        <div className="bg-card p-8">
          <div className="mb-6 flex justify-center">
            <div className="bg-destructive/10 flex h-16 w-16 items-center justify-center rounded-full">
              <AlertCircle className="text-destructive h-8 w-8" />
            </div>
          </div>

          <h1 className="text-foreground mb-2 text-center text-2xl font-semibold">
            Thanh toán không thành công
          </h1>

          <p className="text-muted-foreground mb-6 text-center text-sm">
            Giao dịch thanh toán của bạn không thành công. Vui lòng thử lại.
          </p>

          <div className="bg-muted/50 mb-8 rounded p-4">
            {bookingId && (
              <>
                <p className="text-muted-foreground mt-3 mb-2 text-xs">Mã đặt lịch</p>
                <p className="text-foreground font-mono text-sm">{bookingId}</p>
              </>
            )}
          </div>

          <div className="space-y-3">
            <Link to={paths.customer.root.path} className="block">
              <Button variant="outline" className="w-full bg-transparent">
                Quay lại trang chủ
              </Button>
            </Link>
          </div>

          <p className="text-muted-foreground mt-6 text-center text-xs">
            Nếu sự cố vẫn tiếp diễn, vui lòng liên hệ bộ phận hỗ trợ.
          </p>
        </div>
      </div>
    </div>
  );
}
