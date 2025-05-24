// hooks/use-appointments.ts
import { isSameDay } from "date-fns";
import { Appointment } from "../types/schedule.types";

export const useAppointments = (selectedDate: Date | null, appointments: Appointment[]) => {
  const hasAppointmentsOnSelectedDate = (): boolean => {
    if (!appointments || !selectedDate) return false;

    return appointments.some((appointment) => {
      const appointmentDate = appointment.scheduledDate instanceof Date
        ? appointment.scheduledDate
        : new Date(appointment.scheduledDate);
      return isSameDay(appointmentDate, selectedDate);
    });
  };

  const getAppointmentsForSelectedDate = (): Appointment[] => {
    if (!appointments || !selectedDate) return [];

    return appointments.filter((appointment) => {
      const appointmentDate = appointment.scheduledDate instanceof Date
        ? appointment.scheduledDate
        : new Date(appointment.scheduledDate);
      return isSameDay(appointmentDate, selectedDate);
    });
  };

  return {
    hasAppointmentsOnSelectedDate,
    getAppointmentsForSelectedDate,
  };
};