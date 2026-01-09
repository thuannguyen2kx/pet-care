import { Clock } from 'lucide-react';

import type { TAvailaleSlot } from '@/features/booking/api/types';
import { cn } from '@/shared/lib/utils';
import { Skeleton } from '@/shared/ui/skeleton';

type Props = {
  slots: TAvailaleSlot[];
  selectedTime: string | null;
  onSelect: (time: string) => void;
  isLoading?: boolean;
};

export function BookingTimeSlotGrid({ slots, selectedTime, onSelect, isLoading }: Props) {
  const renderSlotStatus = (slot: TAvailaleSlot, isSelected: boolean) => {
    if (isSelected) return 'Đang chọn';
    if (!slot.available) return 'Đã đặt';
    return 'Còn trống';
  };

  if (isLoading) {
    return (
      <div>
        <Skeleton className="mb-4 h-7 w-32" />
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="border-border rounded-xl border p-3">
              <Skeleton className="mb-2 h-5 w-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (!slots || slots.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-semibold">Chọn giờ</h2>
        <div className="border-border mt-4 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center">
          <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
            <Clock className="text-muted-foreground h-8 w-8" />
          </div>
          <p className="text-foreground mt-4 font-medium">Không có khung giờ nào</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Vui lòng chọn ngày khác hoặc dịch vụ khác
          </p>
        </div>
      </div>
    );
  }
  return (
    <div>
      <h2 className="text-xl font-semibold">Chọn giờ</h2>

      <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
        {slots.map((slot) => {
          const isSelected = slot.startTime === selectedTime;

          return (
            <button
              key={slot.startTime}
              disabled={!slot.available}
              onClick={() => slot.available && onSelect(slot.startTime)}
              className={cn(
                'border-border rounded-xl border py-3 transition',
                isSelected
                  ? 'bg-primary text-primary-foreground'
                  : !slot.available
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'hover:border-primary/50 hover:bg-primary/10 cursor-pointer',
              )}
            >
              <div className="font-semibold">
                {slot.startTime} - {slot.endTime}
              </div>
              <div
                className={cn(
                  'text-xs',
                  isSelected && 'text-primary-foreground font-medium',
                  !isSelected && 'text-muted-foreground',
                )}
              >
                {renderSlotStatus(slot, isSelected)}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
