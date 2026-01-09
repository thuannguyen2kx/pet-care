import { useBookingDateRange } from '@/features/booking/components/create-booking/steps/booking-time-slot-step/use-booking-date-range';
import { cn } from '@/shared/lib/utils';

type Props = {
  selectedDate: string | null;
  onSelect: (date: string) => void;
};

export function BookingDateSelector({ selectedDate, onSelect }: Props) {
  const dates = useBookingDateRange(14);

  const renderDateStatus = (date: ReturnType<typeof useBookingDateRange>[number]) => {
    if (date.iso === selectedDate) return 'Đang chọn';
    if (date.isToday) return 'Hôm nay';
    if (date.isWeekend) return 'Cuối tuần';
    return '';
  };

  return (
    <div>
      <h2 className="text-xl font-semibold">Chọn ngày</h2>
      <p className="text-muted-foreground mt-1 text-sm">Chọn ngày phù hợp trong 2 tuần tới</p>
      <div className="mt-4 grid grid-cols-7 gap-2">
        {dates.map((d) => {
          const isSelected = selectedDate === d.iso;

          return (
            <button
              key={d.iso}
              onClick={() => onSelect(d.iso)}
              className={cn(
                'border-border relative rounded-xl border p-3 text-center transition',
                isSelected && 'border-primary bg-primary text-primary-foreground',
                !isSelected && d.isWeekend
                  ? 'bg-secondary/50 text-secondary-foreground hover:border-primary/50'
                  : 'hover:border-primary/50',
              )}
            >
              <div className="text-xs">{['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][d.weekday]}</div>
              <div className="text-lg font-bold">{d.day}</div>
              <div
                className={cn(
                  'text-[10px]',
                  d.isToday && 'bg-primary text-primary-foreground rounded-full',
                  d.isWeekend && 'bg-accent text-accent-foreground rounded-full',
                )}
              >
                {renderDateStatus(d)}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
