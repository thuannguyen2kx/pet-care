import z from 'zod';

import { bookingDtoSchema, paginationDtoSchema } from '@/features/booking/domain/booking.dto';

export const getBookingsResponseDtoSchema = z.object({
  bookings: z.array(bookingDtoSchema),
  pagination: paginationDtoSchema,
});

export type GetBookingsResponseDto = z.infer<typeof getBookingsResponseDtoSchema>;
