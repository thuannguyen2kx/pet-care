import { BookingDateSelector } from './booking-date-selector';
import { BookingTimeSlotGrid } from './booking-time-slot-grid';

import type { AvailableSlot } from '@/features/availability/domain';

type Props = {
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  isSlotsLoading: boolean;
  timeSlots: AvailableSlot[];
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
