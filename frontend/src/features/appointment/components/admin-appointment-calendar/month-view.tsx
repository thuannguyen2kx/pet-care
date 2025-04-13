import React, { useMemo } from "react";
import { format, startOfMonth, endOfMonth, addDays, isSameMonth, isSameDay, eachDayOfInterval } from "date-fns";
import { vi } from "date-fns/locale";
import { StatusIndicator } from "./status-indicator"; 
import { AdminAppointmentType } from "../../types/api.types";

interface MonthViewProps {
  date: Date;
  appointments: AdminAppointmentType[];
  onDateClick: (date: Date) => void;
  onAppointmentClick: (appointment: AdminAppointmentType) => void;
}

export const MonthView: React.FC<MonthViewProps> = ({
  date,
  appointments,
  onDateClick,
  onAppointmentClick
}) => {
  const now = new Date();
  
  // Generate days of the month with previous/next month padding
  const monthDays = useMemo(() => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    
    // Get days from prev month to start from Monday
    const startDay = monthStart.getDay() || 7; // Convert Sunday (0) to 7
    const prevDays = startDay > 1 ? startDay - 1 : 0;
    
    // Get days in current month and a few days from next month
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // Add days from previous month
    const prevMonthDays = Array.from({ length: prevDays }, (_, i) => {
      return addDays(monthStart, -(prevDays - i));
    });
    
    // Add days from next month to complete the grid (6 rows of 7 days)
    const totalDaysNeeded = 42; // 6 weeks
    const nextMonthDays = Array.from(
      { length: totalDaysNeeded - prevMonthDays.length - daysInMonth.length },
      (_, i) => {
        return addDays(monthEnd, i + 1);
      }
    );
    
    return [...prevMonthDays, ...daysInMonth, ...nextMonthDays];
  }, [date]);

  // Get appointments for a specific day
  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.scheduledTimeSlot.start);
      return isSameDay(appointmentDate, day);
    });
  };

  return (
    <div className="h-full overflow-auto bg-white">
      <div className="sticky top-0 bg-white z-10 p-4 border-b">
        <h2 className="text-xl font-semibold">
          {format(date, "MMMM yyyy", { locale: vi })}
        </h2>
      </div>
      
      <div className="grid grid-cols-7 border-b">
        {["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"].map((day) => (
          <div key={day} className="p-2 text-center font-medium text-sm">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 border-b">
        {monthDays.map((day) => {
          const isToday = isSameDay(day, now);
          const isCurrentMonth = isSameMonth(day, date);
          const dayAppointments = getAppointmentsForDay(day);
          
          return (
            <div 
              key={day.toString()}
              className={`min-h-24 border-r border-b p-1 cursor-pointer ${
                isCurrentMonth ? "bg-white" : "bg-gray-50"
              }`}
              onClick={() => onDateClick(day)}
            >
              <div className="flex justify-between">
                <div 
                  className={`text-sm ${isToday ? 'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center' : isCurrentMonth ? '' : 'text-gray-400'}`}
                >
                  {format(day, "d")}
                </div>
                
                {dayAppointments.length > 0 && (
                  <div className="text-xs text-gray-500 font-medium">
                    {dayAppointments.length}
                  </div>
                )}
              </div>
              
              <div className="mt-1 space-y-1 max-h-20 overflow-y-auto">
                {dayAppointments.slice(0, 3).map((appointment) => (
                  <div 
                    key={appointment._id}
                    className="flex items-center text-xs p-1 rounded truncate cursor-pointer hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAppointmentClick(appointment);
                    }}
                  >
                    <StatusIndicator status={appointment.status} size="sm" />
                    <span className="ml-1 truncate">{format(new Date(appointment.scheduledTimeSlot.start), "HH:mm")}</span>
                  </div>
                ))}
                
                {dayAppointments.length > 3 && (
                  <div className="text-xs text-gray-500 font-medium pl-1">
                    +{dayAppointments.length - 3} khác
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};