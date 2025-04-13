// src/features/appointment/components/calendar/DayView.tsx
import React, { useMemo } from "react";
import { format, isSameDay, isSameHour, parse } from "date-fns";
import { vi } from "date-fns/locale";
import { TimeSlot } from "./time-slot";
import { AppointmentCard } from "./appointment-card";
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
  console.log("DayView render", date.toString(), appointments);
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

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="sticky top-0 bg-white z-10 p-4 border-b">
        <h2 className="text-xl font-semibold">
          {format(date, "EEEE, dd MMMM yyyy", { locale: vi })}
        </h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {timeSlots.map((time) => {
          const timeAppointments = getAppointmentsForTimeSlot(time);
          console.log("Time slot:", time, "Appointments:", timeAppointments);
          
          const isCurrentTime = isSameHour(
            now, 
            parse(time, "HH:mm", new Date())
          );
          
          return (
            <TimeSlot key={time} time={time} isCurrentHour={isCurrentTime}>
              <div className="space-y-2 p-1">
                {timeAppointments.map((appointment) => (
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
                  />
                ))}
              </div>
            </TimeSlot>
          );
        })}
      </div>
    </div>
  );
};