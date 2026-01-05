import { z } from 'zod';

export const createShiftOverrideInputSchema = z
  .object({
    date: z.date().refine((date) => date !== null, {
      message: 'Vui lòng chọn ngày',
    }),

    isWorking: z.boolean(),

    startTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .optional(),

    endTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .optional(),

    reason: z.string().max(500).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isWorking) {
      if (!data.startTime || !data.endTime) {
        ctx.addIssue({
          path: ['startTime'],
          message: 'Phải có giờ làm khi isWorking = true',
          code: 'custom',
        });
      }

      if (data.startTime && data.endTime && data.endTime <= data.startTime) {
        ctx.addIssue({
          path: ['endTime'],
          message: 'Giờ kết thúc phải sau giờ bắt đầu',
          code: 'custom',
        });
      }
    } else {
      // if (data.startTime || data.endTime) {
      //   ctx.addIssue({
      //     path: ['startTime'],
      //     message: 'Không được truyền giờ khi isWorking = false',
      //     code: 'custom',
      //   });
      // }
    }
  });
export type CreateShiftOverrideInput = z.input<typeof createShiftOverrideInputSchema>;

export type CreateShiftOverridePayload = {
  date: string; // YYYY-MM-DD
  isWorking: boolean;
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
  reason?: string;
};
