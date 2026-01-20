import { Dumbbell, HeartPulse, Home, Scissors, Sparkles } from 'lucide-react';
import type { ElementType } from 'react';

import type { ServiceCategory } from '@/features/service/domain/service.entity';
import { SERVICE_CATEGORIES } from '@/features/service/domain/service.entity';

type ServiceCategoryConfig = {
  label: string;
  color: string;
  icon: ElementType;
};
export const SERVICE_CATEGORY_CONFIG: Record<ServiceCategory, ServiceCategoryConfig> = {
  [SERVICE_CATEGORIES.GROOMING]: {
    label: 'Chăm sóc lông',
    color: 'bg-chart-1/10 text-chart-1',
    icon: Scissors,
  },
  [SERVICE_CATEGORIES.SPA]: {
    label: 'Spa thú cưng',
    color: 'bg-chart-5/10 text-chart-5',
    icon: Sparkles,
  },
  [SERVICE_CATEGORIES.HEALTHCARE]: {
    label: 'Chăm sóc sức khoẻ',
    color: 'bg-chart-3/10 text-chart-3',
    icon: HeartPulse,
  },
  [SERVICE_CATEGORIES.TRAINING]: {
    label: 'Huấn luyện',
    color: 'bg-chart-4/10 text-chart-4',
    icon: Dumbbell,
  },
  [SERVICE_CATEGORIES.BOARDING]: {
    label: 'Lưu trú',
    color: 'bg-chart-2/10 text-chart-2',
    icon: Home,
  },
};

// =================
// Helpers
// =================
export const getServiceCategoryConfig = (category: ServiceCategory) =>
  SERVICE_CATEGORY_CONFIG[category];
export const getServiceCategoryLabel = (category: ServiceCategory) =>
  SERVICE_CATEGORY_CONFIG[category].label;
