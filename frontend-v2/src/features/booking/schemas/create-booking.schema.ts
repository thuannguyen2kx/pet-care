import { z } from 'zod';

export const createBookingSchema = z.object({
  petId: z.string().min(1, 'Vui lòng chọn thú cưng'),
  serviceId: z.string().min(1, 'Vui lòng chọn dịch vụ'),
  employeeId: z.string().optional(), // Optional - can auto-assign
  scheduledDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Ngày phải là YYYY-MM-DD'),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Giờ phải là HH:MM'),
  customerNotes: z.string().max(1000).optional(),
});

export type TCreateBookingInput = z.infer<typeof createBookingSchema>;
