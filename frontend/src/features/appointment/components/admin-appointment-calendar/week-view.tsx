import React, { useMemo } from "react";
import { format, addDays, isSameDay, isSameHour, parse } from "date-fns";
import { vi } from "date-fns/locale";
import { AdminAppointmentType } from "@/features/appointment/types/api.types";
import { TimeSlot } from "./time-slot";
import { AppointmentCard } from "./appointment-card";
import { AppointmentOverlapBadge } from "./appointment-overlap-badge";

interface WeekViewProps {
  startDate: Date;
  workDays: string[];
  appointments: AdminAppointmentType[];
  workingHoursStart: string;
  workingHoursEnd: string;
  onAppointmentClick: (appointment: AdminAppointmentType) => void;
  onDateClick?: (date: Date) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({
  startDate,
  workDays,
  appointments,
  workingHoursStart,
  workingHoursEnd,
  onAppointmentClick,
  onDateClick
}) => {
  const now = new Date();
  
  // Generate days of the week based on workDays
  const weekDays = useMemo(() => {
    const days = [];

    
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
      try {
        // Parse the scheduledDate from the appointment
        const appointmentDate = new Date(appointment.scheduledDate);
        if (!isSameDay(appointmentDate, day)) return false;
        
        // Get the hour from the scheduledTimeSlot.start
        const timeStart = appointment.scheduledTimeSlot.start;
        const appointmentHour = parseInt(timeStart.split(':')[0]);
        
        return appointmentHour === hour;
      } catch (error) {
        console.error("Error filtering appointments:", error);
        return false;
      }
    });
  };

  // Group appointments that occur in the same time slot
  const groupAppointmentsByTimeSlot = (appointments: AdminAppointmentType[]) => {
    if (!appointments.length) return [];
    
    const groups: { [key: string]: AdminAppointmentType[] } = {};
    
    appointments.forEach(appointment => {
      const slot = appointment.scheduledTimeSlot.start;
      if (!groups[slot]) {
        groups[slot] = [];
      }
      groups[slot].push(appointment);
    });
    
    return Object.values(groups);
  };

  // Handle day column click
  const handleDayClick = (day: Date, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDateClick) {
      onDateClick(day);
    }
  };
  return (
    <div className="h-full overflow-auto bg-white">
      <div className="sticky top-0 bg-slate-100 z-10 flex">
        <div className="w-16" /> {/* Time column spacer */}
        {weekDays.map((day) => (
          <div 
            key={day.toString()} 
            className={`flex-1 p-2 text-center border-l border-gray-200 cursor-pointer hover:bg-gray-50 ${isSameDay(day, startDate) ? 'bg-blue-50' : ''}`}
            onClick={(e) => handleDayClick(day, e)}
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
      
      <div className="divide-y divide-gray-200 mt-10">
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
                  const appointmentGroups = groupAppointmentsByTimeSlot(timeAppointments);
                   
                  return (
                    <div 
                      key={day.toString()} 
                      className={`flex-1 border-l border-gray-200 relative min-h-14 ${
                        isSameDay(day, startDate) ? 'bg-blue-50' : ''
                      }`}
                      onClick={(e) => handleDayClick(day, e)}
                    >
                      {appointmentGroups.map((group, groupIndex) => (
                        <div key={`group-${groupIndex}`} className="w-full h-full relative px-1 pt-1">
                          {group.map((appointment, index) => (
                            <AppointmentCard
                              key={appointment._id}
                              id={appointment._id}
                              title={appointment.serviceId?.name}
                              time={`${appointment.scheduledTimeSlot.start} - ${appointment.scheduledTimeSlot.end}`}
                              customer={appointment.customerId}
                              pet={appointment.petId}
                              status={appointment.status}
                              employee={appointment.employeeId}
                              onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                onAppointmentClick(appointment);
                              }}
                              isInWeekView={true}
                              isOverlapping={group.length > 1}
                              overlapIndex={index}
                              totalOverlapping={group.length}
                            />
                          ))}
                          
                          {group.length > 1 && (
                            <div className="absolute top-0 right-1 z-50">
                              <AppointmentOverlapBadge 
                                count={group.length} 
                                className="scale-75 origin-top-right"
                              />
                            </div>
                          )}
                        </div>
                      ))}
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