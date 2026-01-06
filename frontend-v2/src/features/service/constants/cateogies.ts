export const CATEGORIES = ['GROOMING', 'SPA', 'HEALTHCARE', 'TRAINING', 'BOARDING'] as const;

export type TCategory = (typeof CATEGORIES)[number];

export const CATEGORY_ALL = 'ALL' as const;
export type TCategoryFilter = TCategory | typeof CATEGORY_ALL;

export const CATEGORY_OPTIONS: { value: TCategory; label: string }[] = [
  { value: 'GROOMING', label: 'Chăm sóc lông' },
  { value: 'SPA', label: 'Spa thú cưng' },
  { value: 'HEALTHCARE', label: 'Chăm sóc sức khỏe' },
  { value: 'TRAINING', label: 'Huấn luyện' },
  { value: 'BOARDING', label: 'Lưu trú' },
];

export const CATEGORY_CONFIG = {
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
