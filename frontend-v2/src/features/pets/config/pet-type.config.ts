import { Cat, Dog } from 'lucide-react';
import type { ElementType } from 'react';

import type { PetType } from '@/features/pets/domain/pet.entity';

type PetTypeConfig = {
  label: string;
  sublabel: string;
  value: PetType;
  icon: ElementType;
};
export const PET_TYPE_CONFIG: Record<PetType, PetTypeConfig> = {
  dog: {
    label: 'Chó',
    sublabel: 'Dog',
    value: 'dog',
    icon: Dog,
  },
  cat: {
    label: 'Mèo',
    sublabel: 'Cat',
    value: 'cat',
    icon: Cat,
  },
} as const;

// ================
// Helpers
// ===============
export function formatPetType(petType: PetType) {
  return PET_TYPE_CONFIG[petType].label;
}
export function getPetTypeConfig(petType: PetType) {
  return PET_TYPE_CONFIG[petType];
}
