import { z } from 'zod';

export const petMedicalNotesSchema = z.string().max(2000).optional();
