import { isSameDay} from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarEvent, Schedule, Appointment } from "../types/schedule.types";
import { formatTime } from "./schedule-utils";
import { isPastDate } from "./date-validation";

// Format calendar events for BigCalendar
export const formatCalendarEvents = (
  schedules: Schedule[], 
  appointments: Appointment[]
): CalendarEvent[] => {
  if (!schedules) return [];

  const events: CalendarEvent[] = [];

  // Add scheduled work days
  schedules.forEach((schedule) => {
    const eventDate = schedule.date instanceof Date
      ? schedule.date
      : new Date(schedule.date);

    // Skip if date is invalid
    if (isNaN(eventDate.getTime())) return;

    // Generate title based on work status and hours
    let title;
    if (schedule.isWorking) {
      if (schedule.workHours.length === 1) {
        title = `Làm việc: ${formatTime(schedule.workHours[0].start)} - ${formatTime(schedule.workHours[0].end)}`;
      } else {
        title = `Làm việc: ${schedule.workHours.length} ca`;
      }
    } else {
      title = "Không làm việc";
    }

    // Create event object
    events.push({
      id: schedule._id || `default-${eventDate.toISOString()}`,
      title,
      start: eventDate,
      end: eventDate,
      allDay: true,
      resource: {
        type: "schedule",
        isWorking: schedule.isWorking,
        workHours: schedule.workHours,
        isDefault: schedule.isDefault || false,
      },
    });
  });

  // Add appointments
  if (appointments) {
    appointments.forEach((appointment) => {
      const appointmentDate = appointment.scheduledDate instanceof Date
        ? appointment.scheduledDate
        : new Date(appointment.scheduledDate);

      // Create appointment event
      events.push({
        id: `appointment-${appointment._id}`,
        title: `${appointment.scheduledTimeSlot.start}-${appointment.scheduledTimeSlot.end}: ${appointment.petId?.name || "Thú cưng"}`,
        start: appointmentDate,
        end: appointmentDate,
        allDay: true,
        resource: {
          type: "appointment",
          appointment,
        },
      });
    });
  }

  return events;
};



// Calendar day styling
interface DayPropGetterOptions {
  schedules: Schedule[];
  appointments: Appointment[];
  currentDate: Date;
  selectedDate: Date | null;
}

export const dayPropGetter = (date: Date, options: DayPropGetterOptions) => {
  const { schedules, appointments, currentDate, selectedDate } = options;
  
  const schedule = schedules.find((s) => {
    const scheduleDate = s.date instanceof Date ? s.date : new Date(s.date);
    return isSameDay(scheduleDate, date);
  });

  const hasAppointments = appointments?.some((a) => {
    const appointmentDate = a.scheduledDate instanceof Date
      ? a.scheduledDate
      : new Date(a.scheduledDate);
    return isSameDay(appointmentDate, date);
  });

  const today = new Date();
  const isCurrentMonth = date.getMonth() === currentDate.getMonth();
  const isPast = isPastDate(date);

  return {
    className: cn(
      "transition-all duration-200",
      isSameDay(date, today) ? "border-2 border-blue-500" : "",
      selectedDate && isSameDay(date, selectedDate) ? "bg-blue-50" : "",
      schedule && !schedule.isWorking ? "bg-red-50" : "",
      schedule && schedule.isWorking && !schedule.isDefault ? "bg-green-50" : "",
      hasAppointments ? "font-bold" : "",
      !isCurrentMonth ? "opacity-40" : "",
      // Past date styling
      isPast ? "opacity-50 cursor-not-allowed bg-gray-100" : "cursor-pointer"
    ),
  };
};