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
    color: 'bg-chart-1/10 text-chart-1',
  },
  SPA: {
    value: 'SPA',
    label: 'Spa thú cưng',
    color: 'bg-chart-5/10 text-chart-5',
  },
  HEALTHCARE: {
    value: 'HEALTHCARE',
    label: 'Chăm sóc sức khoẻ',
    color: 'bg-chart-3/10 text-chart-3',
  },
  TRAINING: {
    value: 'TRAINING',
    label: 'Huấn luyện',
    color: 'bg-chart-4/10 text-chart-4',
  },
  BOARDING: {
    value: 'BOARDING',
    label: 'Lưu trú',
    color: 'bg-chart-2/10 text-chart-2',
  },
} as const;
