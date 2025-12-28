import { Dog, Cat } from 'lucide-react';

export const PET_TYPE_CONFIG = {
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

export type TPetType = keyof typeof PET_TYPE_CONFIG;

export const PET_TYPES = Object.keys(PET_TYPE_CONFIG) as TPetType[];
