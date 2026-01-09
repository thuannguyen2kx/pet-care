import type { TAvailaleSlot } from '@/features/booking/api/types';
import { BookingDateSelector } from '@/features/booking/components/create-booking/steps/booking-time-slot-step/booking-date-selector';
import { BookingTimeSlotGrid } from '@/features/booking/components/create-booking/steps/booking-time-slot-step/booking-time-slot-grid';

type Props = {
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  isSlotsLoading: boolean;
  timeSlots: TAvailaleSlot[];
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
};

export function BookingDatetimeStep(props: Props) {
  return (
    <div className="space-y-8">
      <BookingDateSelector selectedDate={props.selectedDate} onSelect={props.onSelectDate} />

      <BookingTimeSlotGrid
        slots={props.timeSlots}
        selectedTime={props.selectedTime}
        onSelect={props.onSelectTime}
        isLoading={props.isSlotsLoading}
      />
    </div>
  );
}
