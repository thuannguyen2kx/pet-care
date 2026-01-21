import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';

type Props = {
  weekDates: Date[];
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
};
export function WeekToolbar({ weekDates, onNext, onPrev, onToday }: Props) {
  return (
    <Card className="mb-6 rounded-none border-none shadow-none">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="text-primary h-5 w-5" />
            <span className="font-semibold">
              Tuần {weekDates[0].getDate()}/{weekDates[0].getMonth() + 1} - {weekDates[6].getDate()}
              /{weekDates[6].getMonth() + 1}/{weekDates[6].getFullYear()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={onPrev}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={onToday}>
              Hôm nay
            </Button>
            <Button variant="outline" size="icon" onClick={onNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
