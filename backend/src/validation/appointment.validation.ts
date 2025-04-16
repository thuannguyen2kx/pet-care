import { z } from "zod";
import { AppointmentStatus, ServiceType } from "../models/appointment.model";

export const appointmentIdSchema = z.string().min(1, "ID cuộc hẹn không được để trống");

export const timeSlotSchema = z.object({
  start: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Định dạng thời gian không hợp lệ"),
  end: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Định dạng thời gian không hợp lệ")
});

export const createAppointmentSchema = z.object({
  petId: z.string().min(1, "ID thú cưng không được để trống"),
  serviceType: z.nativeEnum(ServiceType, {
    errorMap: () => ({ message: "Loại dịch vụ không hợp lệ" })
  }),
  serviceId: z.string().min(1, "ID dịch vụ không được để trống"),
  scheduledDate: z.string().min(1, "Ngày hẹn không được để trống"),
  scheduledTimeSlot: timeSlotSchema,
  notes: z.string().optional()
});

export const updateAppointmentStatusSchema = z.object({
  status: z.nativeEnum(AppointmentStatus, {
    errorMap: () => ({ message: "Trạng thái không hợp lệ" })
  }),
  serviceNotes: z.string().optional()
});

export const getTimeSlotsSchema = z.object({
  date: z.string().min(1, "Ngày không được để trống"),
  serviceId: z.string().optional(),
  serviceType: z.nativeEnum(ServiceType, {
    errorMap: () => ({ message: "Loại dịch vụ không hợp lệ" })
  }).optional()
});