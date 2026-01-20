import type { ServicesQuery } from '@/features/service/domain/serivice.state';
import type { ServiceDto, ServicesQueryDto } from '@/features/service/domain/service.dto';
import type { Service } from '@/features/service/domain/service.entity';

// ===================
// State => Dto
// ===================
export const mapServicesQueryToDto = (query: ServicesQuery): ServicesQueryDto => {
  const dto: ServicesQueryDto = {};

  if (query.search?.trim()) {
    dto.search = query.search.trim();
  }

  if (query.category) {
    dto.category = query.category;
  }

  if (query.status === 'active') dto.isActive = true;
  if (query.status === 'inactive') dto.isActive = false;
  // all → undefined (don't send)

  switch (query.sort) {
    case 'price_asc':
      dto.sortBy = 'price';
      dto.sortOrder = 'asc';
      break;
    case 'price_desc':
      dto.sortBy = 'price';
      dto.sortOrder = 'desc';
      break;
    default:
      dto.sortBy = 'updatedAt';
      dto.sortOrder = 'desc';
  }

  dto.page = query.page;
  dto.limit = query.limit;

  return dto;
};

// ===================
// Dto => Entity
// ====================

export const mapServiceDtoToEntity = (dto: ServiceDto): Service => {
  return {
    id: dto._id,
    name: dto.name,
    description: dto.description,
    price: dto.price,
    duration: dto.duration,
    category: dto.category,
    requiredSpecialties: dto.requiredSpecialties,
    images: dto.images,
    isActive: dto.isActive,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  };
};
export const mapServicesDtoToEntities = (dtos: ServiceDto[]): Service[] =>
  dtos.map(mapServiceDtoToEntity);
