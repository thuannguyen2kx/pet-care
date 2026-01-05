import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import { Input } from '@/shared/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';

type PickerWithInputProps = {
  value?: Date;
  onChange: (date?: Date) => void;
  disabled?: boolean;
  disabledDate?: (date: Date) => boolean;
};

export function PickerWithInput({ value, onChange, disabled, disabledDate }: PickerWithInputProps) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState<Date | undefined>(value);

  useEffect(() => {
    setMonth(value);
  }, [value]);

  return (
    <div className="relative flex gap-2">
      <Input
        value={value ? format(value, 'dd MMMM yyyy', { locale: vi }) : ''}
        placeholder="Chọn ngày"
        readOnly
        className="bg-background cursor-pointer pr-10"
        onClick={() => setOpen(true)}
      />

      <Popover open={open && !disabled} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            tabIndex={-1}
            className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
          >
            <CalendarIcon className="size-3.5" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="border-border w-auto p-0" align="end">
          <Calendar
            mode="single"
            locale={vi}
            selected={value}
            month={month}
            onMonthChange={setMonth}
            onSelect={(date) => {
              onChange(date);
              setOpen(false);
            }}
            disabled={disabledDate}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
