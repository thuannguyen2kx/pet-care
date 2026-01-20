import type { PetGender } from '@/features/pets/domain/pet.entity';

type PetGenderConfig = {
  label: string;
};

export const PET_GENDER_CONFIG: Record<PetGender, PetGenderConfig> = {
  male: {
    label: 'Giống đực',
  },
  female: {
    label: 'Giống cái',
  },
} as const;

// ===================
// Helpers
// ===================
export function formatGender(gender: PetGender) {
  return PET_GENDER_CONFIG[gender].label;
}
export function getPetGenderConfig(petGender: PetGender) {
  return PET_GENDER_CONFIG[petGender];
}
