import React, { useState } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, addDays, isSameMonth, isSameDay } from "date-fns";
import { vi } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Schedule, Appointment } from "../types/schedule.types";
import { isPastDate } from "../utils/date-validation";

interface ScheduleGridProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  schedules: Schedule[];
  appointments: Appointment[];
  selectedDate: Date | null;
  onDayClick: (date: Date) => void;
}

export const ScheduleGrid: React.FC<ScheduleGridProps> = ({
  currentDate,
  setCurrentDate,
  schedules,
  appointments,
  selectedDate,
  onDayClick,
}) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [datePickerDate, setDatePickerDate] = useState<Date | undefined>(new Date());

  const prevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const getScheduleForDate = (date: Date): Schedule | null => {
    return schedules.find((schedule) => {
      const scheduleDate = schedule.date instanceof Date
        ? schedule.date
        : new Date(schedule.date);
      return isSameDay(scheduleDate, date);
    }) || null;
  };

  const renderGridCalendarDays = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);

    const days = [];
    let day = startDate;

    // Create calendar rows
    while (day <= monthEnd) {
      const week = [];

      // Create week
      for (let i = 0; i < 7; i++) {
        const cloneDay = new Date(day);
        const schedule = getScheduleForDate(cloneDay);
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isPast = isPastDate(cloneDay);
        const hasAppts = appointments?.some(a => {
          const apptDate = a.scheduledDate instanceof Date 
            ? a.scheduledDate 
            : new Date(a.scheduledDate);
          return isSameDay(apptDate, cloneDay);
        });

        week.push(
          <div
            key={day.toString()}
            className={cn(
              "h-16 p-2 border border-gray-200 relative flex flex-col transition-colors",
              isCurrentMonth ? "bg-white" : "bg-gray-50",
              !isCurrentMonth && "text-gray-400",
              isSameDay(day, new Date()) && "border-blue-500 border-2",
              selectedDate && isSameDay(day, selectedDate) && "bg-blue-50",
              // Past date styling
              isPast ? "opacity-50 cursor-not-allowed bg-gray-100" : "cursor-pointer hover:bg-gray-50"
            )}
            onClick={() => isCurrentMonth && !isPast && onDayClick(cloneDay)}
          >
            <span className="text-xs font-medium">{format(day, "d")}</span>
            {isCurrentMonth && schedule && (
              <div className="mt-1">
                {schedule.isWorking ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 text-xs px-1 py-0 border-green-300">
                    Làm việc
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-50 text-red-700 text-xs px-1 py-0 border-red-300">
                    Nghỉ
                  </Badge>
                )}
              </div>
            )}
            {isCurrentMonth && hasAppts && (
              <div className="absolute bottom-1 right-1">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              </div>
            )}
          </div>
        );

        day = addDays(day, 1);
      }

      days.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {week}
        </div>
      );
    }

    return days;
  };

  // Create week days header
  const weekDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
    <div key={day} className="text-center p-2 border-b border-gray-200 font-medium bg-gray-50">
      {day}
    </div>
  ));

  return (
    <Card>
      <CardContent className="p-4">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {format(currentDate, "MMMM yyyy", { locale: vi })
              .charAt(0)
              .toUpperCase() +
              format(currentDate, "MMMM yyyy", { locale: vi }).slice(1)}
          </h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={prevMonth}>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Chọn tháng
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={datePickerDate}
                  onSelect={(date) => {
                    if (date) {
                      setDatePickerDate(date);
                      setCurrentDate(date);
                      setCalendarOpen(false);
                    }
                  }}
                  locale={vi}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Grid calendar */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="grid grid-cols-7">{weekDays}</div>
          {renderGridCalendarDays()}
        </div>

        {/* Legend */}
        <div className="mt-4 p-3 bg-gray-50 rounded-md flex flex-wrap gap-3">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-sm bg-green-50 border border-green-300 mr-2"></div>
            <span className="text-sm">Ngày làm việc</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-sm bg-red-50 border border-red-300 mr-2"></div>
            <span className="text-sm">Ngày nghỉ</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            <span className="text-sm">Có cuộc hẹn</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-sm border-2 border-blue-500 mr-2"></div>
            <span className="text-sm">Hôm nay</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-sm bg-gray-100 opacity-50 mr-2"></div>
            <span className="text-sm text-gray-500">Ngày đã qua (chỉ xem)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};