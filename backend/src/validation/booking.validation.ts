import { z } from "zod";
import { BookingStatus } from "../models/booking.model";
export const createBookingSchema = z.object({
  petId: z.string().min(1, "Pet ID is required"),
  serviceId: z.string().min(1, "Service ID is required"),
  employeeId: z.string().optional(), // Optional - can auto-assign
  scheduledDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be HH:MM"),
  customerNotes: z.string().max(1000).optional(),
});

// Update booking validation
export const updateBookingSchema = z.object({
  scheduledDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .optional(),
  employeeId: z.string().optional(),
  customerNotes: z.string().max(1000).optional(),
});

// Cancel booking validation
export const cancelBookingSchema = z.object({
  reason: z.string().min(1, "Cancellation reason is required").max(500),
});

// Update status validation
export const updateStatusSchema = z.object({
  status: z.enum([
    BookingStatus.CONFIRMED,
    BookingStatus.IN_PROGRESS,
    BookingStatus.COMPLETED,
    BookingStatus.NO_SHOW,
  ]),
  reason: z.string().max(500).optional(),
  employeeNotes: z.string().max(1000).optional(),
});

// Add rating validation
export const addRatingSchema = z.object({
  score: z.number().min(1).max(5),
  feedback: z.string().max(1000).optional(),
});
