import { Calendar, PawPrint, Scissors, Shield, Star, User } from 'lucide-react';

import type {
  BookingSummary,
  BookingSummaryUIModel,
} from '@/features/booking/hooks/use-booking-summary';
import { cn } from '@/shared/lib/utils';
import { Card, CardContent } from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';

type Props = {
  summary: BookingSummary;
};

export function CreateBookingSummary({ summary }: Props) {
  const { service, pet, employee, dateText, timeText, price, duration } = summary;

  const summaryData: BookingSummaryUIModel = {
    items: [
      {
        label: 'Dịch vụ',
        value: service?.name ?? 'Chưa chọn',
        isSelected: !!service,
        icon: <Scissors className="h-5 w-5" />,
        extra: service && (
          <span className="text-primary text-sm font-semibold">{service.price}</span>
        ),
      },
      {
        label: 'Thú cưng',
        value: pet?.name ?? 'Chưa chọn',
        isSelected: !!pet,
        icon: <PawPrint className="h-5 w-5" />,
      },
      {
        label: 'Chuyên viên',
        value: employee?.fullName ?? 'Chưa chọn',
        isSelected: !!employee,
        icon: <User className="h-5 w-5" />,
      },
      {
        label: 'Thời gian',
        value: dateText ? `${dateText} - ${timeText || 'Chưa chọn'}` : 'Chưa chọn',
        isSelected: !!dateText && !!timeText,
        icon: <Calendar className="h-5 w-5" />,
      },
    ],
    totalPrice: price,
    durationText: service ? `Bao gồm ${duration} phút dịch vụ` : undefined,
  };

  return (
    <Card className="bg-card/80 overflow-hidden rounded-none border-0">
      <div className="bg-primary/80 text-primary-foreground p-5">
        <h3 className="font-semibold">Tóm tắt đặt lịch</h3>
        <p className="text-primary-foreground/80 mt-1 text-sm">Thông tin lịch hẹn của bạn</p>
      </div>

      <CardContent className="p-5">
        <div className="space-y-4">
          {summaryData.items.map((item, idx) => (
            <div key={idx}>
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full',
                    item.isSelected
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  {item.icon}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-muted-foreground text-xs">{item.label}</p>
                  <p
                    className={cn(
                      'truncate font-medium',
                      item.isSelected ? 'text-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {item.value}
                  </p>
                </div>

                {item.extra}
              </div>

              {idx < summaryData.items.length - 1 && <Separator className="my-4" />}
            </div>
          ))}
        </div>

        <div className="bg-primary/10 mt-6 p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Tổng thanh toán</span>
            <span className="text-primary text-2xl font-bold">{summaryData.totalPrice}</span>
          </div>
          {summaryData.durationText && (
            <p className="text-muted-foreground mt-1 text-xs">{summaryData.durationText}</p>
          )}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="bg-secondary/50 text-muted-foreground flex items-center gap-2 rounded-lg p-2 text-xs">
            <Shield className="text-primary h-4 w-4" />
            <span>Bảo hành dịch vụ</span>
          </div>
          <div className="bg-secondary/50 text-muted-foreground flex items-center gap-2 rounded-lg p-2 text-xs">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>4.9 sao đánh giá</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
