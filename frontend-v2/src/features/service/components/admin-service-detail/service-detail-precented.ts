import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

import { specialties } from '@/features/employee/constants';
import { CATEGORY_CONFIG } from '@/features/service/constants';
import type { TService } from '@/features/service/domain/service.entity';

export type TServiceView = TService & {
  categoryLabel: string;
  specialties: string[];
  createdAtLabel: string;
  updatedAtLabel: string;
};

export const presentService = (service: TService) => ({
  ...service,
  categoryLabel: CATEGORY_CONFIG[service.category].label,
  specialties: service.requiredSpecialties.map((s) => specialties[s].label),
  createdAtLabel: format(service.createdAt, 'dd/MM/yyyy', {
    locale: vi,
  }),
  updatedAtLabel: format(service.updatedAt, 'dd/MM/yyyy', {
    locale: vi,
  }),
});
