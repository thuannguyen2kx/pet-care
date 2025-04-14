import React, { useMemo } from "react";
import { format, isSameDay, isSameHour, parse, areIntervalsOverlapping } from "date-fns";
import { vi } from "date-fns/locale";
import { TimeSlot } from "./time-slot";
import { AppointmentCard } from "./appointment-card";
import { OverlapIndicator } from "./overlap-indicator";
import { AdminAppointmentType } from "../../types/api.types";

interface DayViewProps {
  date: Date;
  appointments: AdminAppointmentType[];
  workingHoursStart: string;
  workingHoursEnd: string;
  onAppointmentClick: (appointment: AdminAppointmentType) => void;
}

export const DayView: React.FC<DayViewProps> = ({
  date,
  appointments,
  workingHoursStart,
  workingHoursEnd,
  onAppointmentClick
}) => {
  const now = new Date();

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

  // Filter appointments for the selected day
  const dayAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      // Parse the scheduledDate from the appointment
      const appointmentDate = new Date(appointment.scheduledDate);
      return isSameDay(appointmentDate, date);
    });
  }, [appointments, date]);

  // Find appointments for a specific time slot
  const getAppointmentsForTimeSlot = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    
    return dayAppointments.filter(appointment => {
      // Get the hour from the scheduledTimeSlot.start
      const timeStart = appointment.scheduledTimeSlot.start;
      const appointmentHour = parseInt(timeStart.split(':')[0]);
      
      return appointmentHour === hour;
    });
  };

  // Group overlapping appointments
  const groupOverlappingAppointments = (appointments: AdminAppointmentType[]) => {
    if (!appointments.length) return [];
    
    // Create groups of overlapping appointments
    const groups: AdminAppointmentType[][] = [];
    
    appointments.forEach(appointment => {
      // Calculate start and end times for this appointment
      const startTime = parseTimeString(appointment.scheduledDate, appointment.scheduledTimeSlot.start);
      const endTime = parseTimeString(appointment.scheduledDate, appointment.scheduledTimeSlot.end);
      
      // Find a group where this appointment overlaps with any existing appointment
      let foundGroup = false;
      
      for (const group of groups) {
        let overlapsWithAny = false;
        
        for (const groupAppointment of group) {
          const groupStartTime = parseTimeString(
            groupAppointment.scheduledDate, 
            groupAppointment.scheduledTimeSlot.start
          );
          const groupEndTime = parseTimeString(
            groupAppointment.scheduledDate, 
            groupAppointment.scheduledTimeSlot.end
          );
          
          // Check if the intervals overlap
          if (areIntervalsOverlapping(
            { start: startTime, end: endTime },
            { start: groupStartTime, end: groupEndTime }
          )) {
            overlapsWithAny = true;
            break;
          }
        }
        
        if (overlapsWithAny) {
          group.push(appointment);
          foundGroup = true;
          break;
        }
      }
      
      // If no overlapping group was found, create a new group
      if (!foundGroup) {
        groups.push([appointment]);
      }
    });
    
    return groups;
  };
  
  // Helper function to parse time string to Date
  const parseTimeString = (dateStr: string, timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date(dateStr);
    date.setHours(hours, minutes);
    return date;
  };

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="sticky top-0 bg-slate-50 z-10 p-4 ">
        <h2 className="text-xl font-semibold">
          {format(date, "EEEE, dd MMMM yyyy", { locale: vi })}
        </h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {timeSlots.map((time) => {
          const timeAppointments = getAppointmentsForTimeSlot(time);
          
          // Group overlapping appointments
          const appointmentGroups = groupOverlappingAppointments(timeAppointments);
          
          const isCurrentTime = isSameHour(
            now, 
            parse(time, "HH:mm", new Date())
          );
          
          return (
            <TimeSlot key={time} time={time} isCurrentHour={isCurrentTime}>
              <div className="space-y-2 p-1">
                {appointmentGroups.map((group, groupIndex) => (
                  <div key={`group-${groupIndex}`} className="space-y-1 relative">
                    {group.map((appointment, index) => (
                      <AppointmentCard
                        key={appointment._id}
                        id={appointment._id}
                        title={appointment.serviceId?.name || "Dịch vụ không xác định"}
                        time={`${appointment.scheduledTimeSlot.start} - ${appointment.scheduledTimeSlot.end}`}
                        customer={appointment.customerId}
                        pet={appointment.petId}
                        status={appointment.status}
                        employee={appointment.employeeId}
                        onClick={() => onAppointmentClick(appointment)}
                        isOverlapping={group.length > 1}
                        overlapIndex={index}
                        totalOverlapping={group.length}
                      />
                    ))}
                    {group.length > 1 && groupIndex === 0 && (
                      <OverlapIndicator 
                        count={group.length - 1} 
                        totalAppointments={group.length} 
                      />
                    )}
                  </div>
                ))}
              </div>
            </TimeSlot>
          );
        })}
      </div>
    </div>
  );
};