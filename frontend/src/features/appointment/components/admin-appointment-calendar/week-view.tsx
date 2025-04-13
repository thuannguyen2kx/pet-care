import React, { useMemo } from "react";
import { format, addDays, isSameDay, isSameHour, parse } from "date-fns";
import { vi } from "date-fns/locale";
import { AdminAppointmentType } from "@/features/appointment/types/api.types";
import { TimeSlot } from "./time-slot";
import { AppointmentCard } from "./appointment-card";

interface WeekViewProps {
  startDate: Date;
  workDays: string[];
  appointments: AdminAppointmentType[];
  workingHoursStart: string;
  workingHoursEnd: string;
  onAppointmentClick: (appointment: AdminAppointmentType) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({
  startDate,
  workDays,
  appointments,
  workingHoursStart,
  workingHoursEnd,
  onAppointmentClick
}) => {
  const now = new Date();
  
  // Generate days of the week based on workDays
  const weekDays = useMemo(() => {
    const days = [];
    const daysMap: { [key: string]: number } = {
      "Sunday": 0,
      "Monday": 1,
      "Tuesday": 2,
      "Wednesday": 3,
      "Thursday": 4,
      "Friday": 5,
      "Saturday": 6
    };
    
    // Start from Monday of the week
    const start = new Date(startDate);
    start.setDate(start.getDate() - start.getDay() + 1); // Adjust to Monday
    
    for (let i = 0; i < 7; i++) {
      const day = addDays(start, i);
      const dayName = format(day, "EEEE");
      
      // Only include work days
      if (workDays.includes(dayName)) {
        days.push(day);
      }
    }
    
    return days;
  }, [startDate, workDays]);

  // Generate time slots based on working hours
  const timeSlots = useMemo(() => {
    const slots = [];
    const startHour = parseInt(workingHoursStart.split(':')[0]);
    const endHour = parseInt(workingHoursEnd.split(':')[0]);
    
    for (let hour = startHour; hour <= endHour; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      slots.push(time);
    }
    
    return slots;
  }, [workingHoursStart, workingHoursEnd]);

  // Find appointments for a specific time slot and day
  const getAppointmentsForTimeSlotAndDay = (time: string, day: Date) => {
    const hour = parseInt(time.split(':')[0]);
    
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.start);
      return (
        isSameDay(appointmentDate, day) && 
        appointmentDate.getHours() === hour
      );
    });
  };

  return (
    <div className="h-full overflow-auto bg-white">
      <div className="sticky top-0 bg-white z-10 flex border-b">
        <div className="w-16" /> {/* Time column spacer */}
        {weekDays.map((day) => (
          <div 
            key={day.toString()} 
            className="flex-1 p-2 text-center border-l border-gray-200"
          >
            <div className={`font-medium ${isSameDay(day, now) ? 'text-blue-600' : ''}`}>
              {format(day, "EEE", { locale: vi })}
            </div>
            <div className={`text-lg ${isSameDay(day, now) ? 'text-blue-600 font-bold' : ''}`}>
              {format(day, "dd", { locale: vi })}
            </div>
          </div>
        ))}
      </div>
      
      <div className="divide-y divide-gray-200">
        {timeSlots.map((time) => {
          const isCurrentTime = isSameHour(
            now, 
            parse(time, "HH:mm", new Date())
          );
          
          return (
            <TimeSlot key={time} time={time} isCurrentHour={isCurrentTime}>
              <div className="flex h-full">
                {weekDays.map((day) => {
                  const timeAppointments = getAppointmentsForTimeSlotAndDay(time, day);
                  
                  return (
                    <div 
                      key={day.toString()} 
                      className="flex-1 border-l border-gray-200 p-1"
                    >
                      <div className="space-y-1">
                        {timeAppointments.map((appointment) => (
                          <AppointmentCard
                            key={appointment._id}
                            id={appointment._id}
                            time={`${format(new Date(appointment.scheduledTimeSlot.start), "HH:mm")} - ${format(new Date(appointment.scheduledTimeSlot.end), "HH:mm")}`}
                            customer={appointment.customerId}
                            pet={appointment.petId}
                            status={appointment.status}
                            employee={appointment.employeeId}
                            onClick={() => onAppointmentClick(appointment)}
                            isInWeekView={true}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </TimeSlot>
          );
        })}
      </div>
    </div>
  );
};