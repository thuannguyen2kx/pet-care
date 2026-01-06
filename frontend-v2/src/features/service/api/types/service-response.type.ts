import type { TService } from '@/features/service/domain/service.entity';
import type { TApiResponseSuccess } from '@/shared/types';

export type TPaginationMeta = {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type TGetServicesResponse = {
  services: TService[];
  pagination: TPaginationMeta;
};
export type TGetServicesApiResponse = TApiResponseSuccess<TGetServicesResponse>;
