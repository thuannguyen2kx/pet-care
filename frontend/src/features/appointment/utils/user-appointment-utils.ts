import { isAfter } from "date-fns";
import { UserAppointmentType } from "@/features/appointment/types/api.types";
import { AppointmentStatus } from "@/constants";

/**
 * Filter appointments by status and search term
 */
export const filterAppointmentsByStatusAndTerm = (
  appointments: UserAppointmentType[],
  statusFilter: string,
  searchTerm: string
): UserAppointmentType[] => {
  return appointments.filter((appointment) => {
    const matchesStatus = !statusFilter || appointment.status === statusFilter;
    const matchesSearch =
      !searchTerm ||
      appointment.petId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (appointment.employeeId?.fullName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });
};

/**
 * Separate appointments into upcoming and past based on date
 */
export const separateAppointmentsByDate = (
  appointments: UserAppointmentType[]
): {
  upcomingAppointments: UserAppointmentType[];
  pastAppointments: UserAppointmentType[];
} => {
  const now = new Date();
  
  const upcomingAppointments = appointments.filter(
    (appointment) =>
      isAfter(new Date(appointment.scheduledDate), now) ||
      appointment.status === AppointmentStatus.PENDING ||
      appointment.status === AppointmentStatus.CONFIRMED||
      appointment.status === AppointmentStatus.IN_PROGRESS
  );

  const pastAppointments = appointments.filter(
    (appointment) => !upcomingAppointments.includes(appointment)
  );

  return { upcomingAppointments, pastAppointments };
};