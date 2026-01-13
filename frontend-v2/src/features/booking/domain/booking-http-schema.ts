import z from 'zod';

import {
  bookingDetailDtoSchema,
  bookingDtoSchema,
  paginationDtoSchema,
} from '@/features/booking/domain/booking.dto';

export const getBookingsResponseDtoSchema = z.object({
  bookings: z.array(bookingDtoSchema),
  pagination: paginationDtoSchema,
});
export const bookingDetailResponseDtoSchema = z.object({
  booking: bookingDetailDtoSchema,
});
export type GetBookingsResponseDto = z.infer<typeof getBookingsResponseDtoSchema>;
export type BookingDetailResponseDto = z.infer<typeof bookingDetailResponseDtoSchema>;
