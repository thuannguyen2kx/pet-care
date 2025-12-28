export const PET_GENDER_CONFIG = {
  male: {
    label: 'Giống đực',
  },
  female: {
    label: 'Giống cái',
  },
} as const;

// 'dog' | 'cat'

export type TPetGender = keyof typeof PET_GENDER_CONFIG;

export const PET_GENDERS = Object.keys(PET_GENDER_CONFIG) as TPetGender[];
