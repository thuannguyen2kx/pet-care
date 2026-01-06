export const SPECIALTIES = [
  "GROOMING",
  "SPA",
  "HEALTHCARE",
  "TRAINING",
  "BOARDING",
] as const;

export type SpecialtyType = (typeof SPECIALTIES)[number];
