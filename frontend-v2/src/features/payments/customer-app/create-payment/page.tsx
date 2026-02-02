import { Calendar, Check } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { useBooking } from '@/features/booking/api/get-booking';
import { useProcessPayment } from '@/features/payments/api/payment-process';
import { useCreateStripeCheckout } from '@/features/payments/api/stripe-checkout';
import { PAYMENT_METHODS_CONFIG } from '@/features/payments/config/payment-method.config';
import { PAYMENT_METHOD, type PaymentMethod } from '@/features/payments/domain/payment.entity';
import { EmptyState } from '@/shared/components/template/empty-state';
import { SectionSpinner } from '@/shared/components/template/loading';
import { paths } from '@/shared/config/paths';
import { formatCurrency } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';

export default function PaymentPage() {
  const params = useParams();
  const bookingId = params.bookingId as string;

  const bookingQuery = useBooking({ bookingId });

  const navigate = useNavigate();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(PAYMENT_METHOD.CASH);

  const processPaymentMutation = useProcessPayment({
    mutationConfig: {
      onSuccess: () => {
        navigate(paths.customer.successBooking.path);
      },
    },
  });

  const stripeCheckoutMutation = useCreateStripeCheckout({
    mutationConfig: {
      onSuccess: (data) => {
        window.location.href = data.url;
      },
    },
  });

  const handlePay = () => {
    if (selectedMethod === PAYMENT_METHOD.CASH) {
      processPaymentMutation.mutate({ bookingId, paymentMethod: PAYMENT_METHOD.CASH });
    } else {
      stripeCheckoutMutation.mutate({ bookingId });
    }
  };

  if (bookingQuery.isLoading) {
    return <SectionSpinner />;
  }
  if (!bookingQuery.data) {
    <EmptyState
      title="Không tìm thấy thông tin đặt lịch"
      description="Lịch đặt không tồn tại hoặc có thể đã bị xoá"
      icon={Calendar}
    />;
  }
  const booking = bookingQuery.data;
  return (
    <main className="bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-12">
          <h1 className="mb-2 text-3xl font-light tracking-tight">Hoàn tất thanh toán</h1>
          <p className="text-muted-foreground">Chọn phương thức thanh toán ưa thích của bạn</p>
        </div>

        <div className="border-border mb-10 border-b pb-10">
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-muted-foreground text-sm">Dịch vụ</span>
            <span className="font-light">{booking?.service.name}</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-muted-foreground text-sm">Tổng tiền</span>
            <span className="text-2xl font-light">{formatCurrency(booking?.totalAmount || 0)}</span>
          </div>
        </div>

        <div className="mb-8 space-y-3">
          {Object.entries(PAYMENT_METHODS_CONFIG).map(([method, config]) => (
            <button
              key={config.id}
              onClick={() => setSelectedMethod(method as PaymentMethod)}
              className={`flex w-full items-center gap-4 rounded-lg border p-4 transition-all duration-200 ${
                selectedMethod === method
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  selectedMethod === method ? 'border-primary bg-primary' : 'border-border'
                }`}
              >
                {selectedMethod === method && <Check className="text-primary-foreground h-3 w-3" />}
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium">{config.name}</div>
                <div className="text-muted-foreground mt-1 text-xs">{config.description}</div>
              </div>
              <div className="text-muted-foreground">
                <config.icon className="size-5" />
              </div>
            </button>
          ))}
        </div>

        <Button onClick={handlePay} disabled={false} className="w-full" size="lg">
          {selectedMethod === PAYMENT_METHOD.CASH ? 'Xác nhận đặt lịch' : 'Thanh toán ngay'}
        </Button>

        <p className="text-muted-foreground mt-6 text-center text-xs">
          Thông tin thanh toán của bạn được bảo mật và mã hóa.
        </p>
      </div>
    </main>
  );
}
