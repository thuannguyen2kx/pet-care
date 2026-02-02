import { z } from 'zod';

import { EmployeeSpecialtySchema } from '@/features/employee/domain/employee.entity';
import { isoDateSchema, mongoObjectIdSchema, time24hSchema } from '@/shared/lib/zod-primitives';

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const CreateShiftTemplateDtoSchema = z.object({
  dayOfWeek: z.coerce.number().min(0).max(6),
  startTime: z.string().regex(TIME_REGEX, 'Thời gian không hợp lệ'),
  endTime: z.string().regex(TIME_REGEX, 'Thời gian không hợp lệ'),
  effectiveFrom: isoDateSchema,
  effectiveTo: isoDateSchema.optional(),
});

export const BuilkShiftsTemplateDtoSchema = z.object({
  shifts: z.array(
    z.object({
      dayOfWeek: z.coerce.number().min(0).max(6),
      startTime: time24hSchema,
      endTime: time24hSchema,
    }),
  ),
  effectiveFrom: isoDateSchema,
  effectiveTo: isoDateSchema.optional(),
});

export const ReplaceShiftTemplateDtoSchema = z.object({
  startTime: z.string().regex(TIME_REGEX, 'Thời gian không hợp lệ'),
  endTime: z.string().regex(TIME_REGEX, 'Thời gian không hợp lệ'),
  effectiveFrom: isoDateSchema,
});
export const DisableShiftTemplateDtoSchema = z.object({
  effectiveTo: isoDateSchema,
});

export const CreateShiftOverrideDtoSchema = z.object({
  date: isoDateSchema,
  isWorking: z.boolean(),
  startTime: time24hSchema.optional(),
  endTime: time24hSchema.optional(),
  reason: z.string().max(500).optional(),
});
export const CreateBreakTemplateDtoSchema = z.object({
  dayOfWeek: z.number().min(0).max(6).optional(),
  startTime: time24hSchema,
  endTime: time24hSchema,
  name: z.string().min(1).max(100),
  effectiveFrom: isoDateSchema,
  effectiveTo: isoDateSchema.optional(),
});

// =====================
// Response Dto
// =====================
export const EmployeeScheduleDtoSchema = z.object({
  date: isoDateSchema,
  dayOfWeek: z.number().min(0).max(6),
  isWorking: z.boolean(),

  startTime: time24hSchema.optional(),
  endTime: time24hSchema.optional(),

  breaks: z.array(
    z.object({
      name: z.string(),
      startTime: time24hSchema,
      endTime: time24hSchema,
    }),
  ),

  override: z
    .object({
      reason: z.string().optional(),
    })
    .optional(),
});

export const EmployeeWeekScheduleDtoSchema = z.object({
  employeeId: z.string(),
  fullName: z.string(),
  email: z.string(),
  profilePicture: z.string().nullable(),
  specialties: z.array(EmployeeSpecialtySchema),

  workHours: z.object({
    start: time24hSchema,
    end: time24hSchema,
  }),
  days: z.array(EmployeeScheduleDtoSchema),
});

export const ShiftTemplateDtoSchema = z.object({
  _id: mongoObjectIdSchema,
  employeeId: mongoObjectIdSchema,
  dayOfWeek: z.number().min(0).max(6),
  startTime: time24hSchema,
  endTime: time24hSchema,
  effectiveFrom: z.string(),
  effectiveTo: z.string().nullable().optional(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ShiftOverrideDtoSchmema = z.object({
  _id: mongoObjectIdSchema,
  employeeId: mongoObjectIdSchema,
  date: z.string(),
  isWorking: z.boolean(),
  reason: z.string(),
  createdBy: z
    .object({
      _id: mongoObjectIdSchema,
      fullName: z.string(),
    })
    .optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export const BreakTemplateDtoSchema = z.object({
  _id: mongoObjectIdSchema,
  employeeId: mongoObjectIdSchema,
  dayOfWeek: z.number().min(0).max(6).optional(),
  name: z.string(),
  startTime: time24hSchema,
  endTime: time24hSchema,
  effectiveFrom: z.string(),
  effectiveTo: z.string().optional(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
// ===================
// Types
// ===================
export type EmployeeScheduleDto = z.infer<typeof EmployeeScheduleDtoSchema>;
export type EmployeeWeekScheduleDto = z.infer<typeof EmployeeWeekScheduleDtoSchema>;
export type CreateShiftTemplateDto = z.infer<typeof CreateShiftTemplateDtoSchema>;
export type BuilkShiftsTemplateDto = z.infer<typeof BuilkShiftsTemplateDtoSchema>;
export type ReplaceShiftTemplateDto = z.infer<typeof ReplaceShiftTemplateDtoSchema>;
export type DisableShiftTemplateDto = z.infer<typeof DisableShiftTemplateDtoSchema>;
export type CreateShiftOverrideDto = z.infer<typeof CreateShiftOverrideDtoSchema>;
export type CreateBreakTemplateDto = z.infer<typeof CreateBreakTemplateDtoSchema>;
export type ShiftTemplateDto = z.infer<typeof ShiftTemplateDtoSchema>;
export type ShiftOverrideDto = z.infer<typeof ShiftOverrideDtoSchmema>;
export type BreakTemplateDto = z.infer<typeof BreakTemplateDtoSchema>;
