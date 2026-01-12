import z from 'zod';

export const mongoObjectIdSchema = z
  .string()
  .length(24)
  .regex(/^[0-9a-fA-F]{24}$/);

export const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const time24hSchema = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/);
