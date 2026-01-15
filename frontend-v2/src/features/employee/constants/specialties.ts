export const specialties = {
  GROOMING: {
    value: 'GROOMING',
    label: 'Chăm sóc lông',
  },
  SPA: {
    value: 'SPA',
    label: 'Spa thú cưng',
  },
  HEALTHCARE: {
    value: 'HEALTHCARE',
    label: 'Chăm sóc sức khoẻ',
  },
  TRAINING: {
    value: 'TRAINING',
    label: 'Huấn luyện',
  },
  BOARDING: {
    value: 'BOARDING',
    label: 'Lưu trú',
  },
} as const;
export const specialtiesList = Object.values(specialties);
export type Specialty = (typeof specialtiesList)[number]['value'];

export const getSpecialtyLabel = (specialty: Specialty) => specialties[specialty].label;
