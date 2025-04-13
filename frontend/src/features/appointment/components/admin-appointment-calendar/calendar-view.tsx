// src/features/appointment/components/calendar/CalendarView.tsx
import React from "react";
import { addDays, subDays, startOfMonth, endOfMonth } from "date-fns";
import { DayView } from "./day-view";
import { WeekView } from "./week-view";
import { MonthView } from "./month-view";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { AdminAppointmentType } from "../../types/api.types";

type CalendarViewType = "day" | "week" | "month";

interface CalendarViewProps {
  appointments: AdminAppointmentType[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  viewType: CalendarViewType;
  onViewTypeChange: (viewType: CalendarViewType) => void;
  workingHoursStart: string;
  workingHoursEnd: string;
  workDays: string[];
  onAppointmentClick: (appointment: AdminAppointmentType) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  appointments,
  selectedDate,
  onDateChange,
  viewType,
  onViewTypeChange,
  workingHoursStart,
  workingHoursEnd,
  workDays,
  onAppointmentClick
}) => {
  // Handle navigation
  const handlePrevious = () => {
    if (viewType === "day") {
      onDateChange(subDays(selectedDate, 1));
    } else if (viewType === "week") {
      onDateChange(subDays(selectedDate, 7));
    } else {
      onDateChange(startOfMonth(subDays(selectedDate, 1)));
    }
  };

  const handleNext = () => {
    if (viewType === "day") {
      onDateChange(addDays(selectedDate, 1));
    } else if (viewType === "week") {
      onDateChange(addDays(selectedDate, 7));
    } else {
      onDateChange(startOfMonth(addDays(endOfMonth(selectedDate), 1)));
    }
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  const handleDateClick = (date: Date) => {
    onDateChange(date);
    if (viewType === "month") {
      onViewTypeChange("day");
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToday}
          >
            <CalendarIcon className="h-4 w-4 mr-1" />
            Hôm nay
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewType === "day" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewTypeChange("day")}
          >
            Ngày
          </Button>
          
          <Button
            variant={viewType === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewTypeChange("week")}
          >
            Tuần
          </Button>
          
          <Button
            variant={viewType === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewTypeChange("month")}
          >
            Tháng
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        {viewType === "day" && (
          <DayView
            date={selectedDate}
            appointments={appointments}
            workingHoursStart={workingHoursStart}
            workingHoursEnd={workingHoursEnd}
            onAppointmentClick={onAppointmentClick}
          />
        )}
        
        {viewType === "week" && (
          <WeekView
            startDate={selectedDate}
            workDays={workDays}
            appointments={appointments}
            workingHoursStart={workingHoursStart}
            workingHoursEnd={workingHoursEnd}
            onAppointmentClick={onAppointmentClick}
          />
        )}
        
        {viewType === "month" && (
          <MonthView
            date={selectedDate}
            appointments={appointments}
            onDateClick={handleDateClick}
            onAppointmentClick={onAppointmentClick}
          />
        )}
      </div>
    </div>
  );
};