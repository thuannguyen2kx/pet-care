import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

import { formatEmployeeSpecialty } from '@/features/employee/config';
import { getServiceCategoryConfig } from '@/features/service/config';
import type { Service } from '@/features/service/domain/service.entity';

export type ServiceView = Service & {
  categoryLabel: string;
  specialties: string[];
  createdAtLabel: string;
  updatedAtLabel: string;
};

export const presentService = (service: Service) => ({
  ...service,
  categoryLabel: getServiceCategoryConfig(service.category).label,
  specialties: service.requiredSpecialties.map(formatEmployeeSpecialty),
  createdAtLabel: format(service.createdAt, 'dd/MM/yyyy', {
    locale: vi,
  }),
  updatedAtLabel: format(service.updatedAt, 'dd/MM/yyyy', {
    locale: vi,
  }),
});
