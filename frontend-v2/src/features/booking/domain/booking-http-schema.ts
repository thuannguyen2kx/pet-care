import z from 'zod';

import {
  bookingDetailDtoSchema,
  bookingDtoSchema,
  bookingScheduleDayDtoSchema,
  bookingStatisticDtoSchema,
  bookingTodayStatisticDtoSchema,
  paginationDtoSchema,
} from '@/features/booking/domain/booking.dto';

export const getBookingsResponseDtoSchema = z.object({
  bookings: z.array(bookingDtoSchema),
  pagination: paginationDtoSchema,
});
export const bookingDetailResponseDtoSchema = z.object({
  booking: bookingDetailDtoSchema,
});
export const bookingStatisticResponseSchema = z.object({
  stats: bookingStatisticDtoSchema,
});

export const bookingTodayStatisticResponseSchema = z.object({
  stats: bookingTodayStatisticDtoSchema,
});
export const bookingScheduleResponseSchema = z.object({
  data: z.object({
    days: z.array(bookingScheduleDayDtoSchema),
  }),
});

export const createBookingResponseDtoSchema = z.object({
  booking: z.object({
    _id: bookingDetailDtoSchema.shape._id,
  }),
});

export type GetBookingsResponseDto = z.infer<typeof getBookingsResponseDtoSchema>;
export type BookingDetailResponseDto = z.infer<typeof bookingDetailResponseDtoSchema>;
