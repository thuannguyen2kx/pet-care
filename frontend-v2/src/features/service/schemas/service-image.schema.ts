import { z } from 'zod';

export const existingImageSchema = z.object({
  id: z.string(),
  url: z.string().url(),
});

export const newImageSchema = z.object({
  file: z.instanceof(File),
  previewUrl: z.string(),
});

export const imageFieldSchema = z.object({
  existing: z.array(existingImageSchema),
  added: z.array(newImageSchema),
});
