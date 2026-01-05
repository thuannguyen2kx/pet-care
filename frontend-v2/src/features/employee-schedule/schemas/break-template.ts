import { z } from 'zod';

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;
export const createBreakTemplateInputSchema = z.discriminatedUnion('breakType', [
  z.object({
    breakType: z.literal('WEEKLY'),
    dayOfWeek: z.number().min(0).max(6),
    name: z.string().min(1).max(100),
    startTime: z.string().regex(TIME_REGEX),
    endTime: z.string().regex(TIME_REGEX),
    effectiveFrom: z.date(),
    effectiveTo: z.date().optional(),
  }),

  z.object({
    breakType: z.literal('DATE'),
    name: z.string().min(1).max(100),
    startTime: z.string().regex(TIME_REGEX),
    endTime: z.string().regex(TIME_REGEX),
    effectiveFrom: z.date(),
    effectiveTo: z.date().optional(),
  }),
]);

export type TCreateBreakTemplateInput = z.infer<typeof createBreakTemplateInputSchema>;
export type TCreateBreakTemplatePayload =
  | {
      name: string;
      dayOfWeek: number; // REQUIRED
      startTime: string;
      endTime: string;
      effectiveFrom: string; // YYYY-MM-DD
      effectiveTo?: string;
    }
  | {
      name: string;
      startTime: string;
      endTime: string;
      effectiveFrom: string; // YYYY-MM-DD
      effectiveTo?: string;
    };
