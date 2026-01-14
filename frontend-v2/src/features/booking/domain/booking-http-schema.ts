import z from 'zod';

import {
  bookingDetailDtoSchema,
  bookingDtoSchema,
  paginationDtoSchema,
} from '@/features/booking/domain/booking.dto';
import { bookingStatisticSchema } from '@/features/booking/domain/booking.entity';

export const getBookingsResponseDtoSchema = z.object({
  bookings: z.array(bookingDtoSchema),
  pagination: paginationDtoSchema,
});
export const bookingDetailResponseDtoSchema = z.object({
  booking: bookingDetailDtoSchema,
});
export const bookingStatisticResponseSchema = z.object({
  stats: bookingStatisticSchema,
});
export type GetBookingsResponseDto = z.infer<typeof getBookingsResponseDtoSchema>;
export type BookingDetailResponseDto = z.infer<typeof bookingDetailResponseDtoSchema>;
