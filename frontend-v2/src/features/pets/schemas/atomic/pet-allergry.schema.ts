import { z } from 'zod';

export const petAllergyItemSchema = z.object({
  value: z.string().min(1),
});

export const petAllergiesSchema = z.array(petAllergyItemSchema).default([]);
