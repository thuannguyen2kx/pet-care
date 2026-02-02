import { CheckCircle } from 'lucide-react';
import { Link, useSearchParams } from 'react-router';

import { paths } from '@/shared/config/paths';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('booking_id');

  return (
    <div className="bg-background flex items-center justify-center px-4 py-16">
      <Card className="w-full max-w-xl rounded-none border-none shadow-none">
        <CardContent className="space-y-8 p-12 text-center">
          <div className="flex justify-center">
            <div className="bg-primary/10 rounded-full p-4">
              <CheckCircle className="text-primary h-12 w-12" />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-foreground text-2xl font-semibold">Thanh toán thành công</h1>
            <p className="text-muted-foreground text-base">
              Giao dịch thanh toán của bạn đã được xử lý và xác nhận.
            </p>
          </div>

          {bookingId && (
            <div className="border-border space-y-2 border-y py-6">
              {bookingId && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Mã đặt lịch</span>
                  <span className="text-foreground font-mono font-medium">{bookingId}</span>
                </div>
              )}
            </div>
          )}

          <p className="text-muted-foreground text-sm">
            Một email xác nhận đã được gửi đến địa chỉ email bạn đã đăng ký.
          </p>

          <div className="flex flex-col gap-3">
            {bookingId && (
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link to={paths.customer.bookingDetail.getHref(bookingId)}>
                  Xem chi tiết đặt lịch
                </Link>
              </Button>
            )}

            <Button asChild className="w-full">
              <Link to={paths.customer.root.path}>Quay lại trang chủ</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
