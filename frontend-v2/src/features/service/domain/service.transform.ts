import type {
  CreateService,
  ServicesQuery,
  UpdateService,
} from '@/features/service/domain/serivice.state';
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
export const buildCreateServiceFormData = (data: CreateService): FormData => {
  const formData = new FormData();

  // Basic fields
  formData.append('name', data.name);
  if (data.description) formData.append('description', data.description);
  formData.append('price', data.price.toString());
  formData.append('duration', data.duration.toString());
  formData.append('category', data.category);
  formData.append('isActive', String(data.isActive));

  data.requiredSpecialties.forEach((s) => {
    formData.append('requiredSpecialties[]', s);
  });

  // Images
  data.images.added.forEach((img) => {
    formData.append('images', img.file);
  });

  data.images.existing.forEach((img) => {
    formData.append('keepImageIds[]', img.id);
  });

  return formData;
};

export const buildUpdateServiceFormData = (data: UpdateService): FormData => {
  const formData = new FormData();

  if (data.name !== undefined) {
    formData.append('name', data.name);
  }

  if (data.description !== undefined) {
    formData.append('description', data.description);
  }

  if (data.price !== undefined) {
    formData.append('price', data.price.toString());
  }

  if (data.duration !== undefined) {
    formData.append('duration', data.duration.toString());
  }

  if (data.category !== undefined) {
    formData.append('category', data.category);
  }

  if (data.isActive !== undefined) {
    formData.append('isActive', String(data.isActive));
  }

  if (data.requiredSpecialties !== undefined) {
    data.requiredSpecialties.forEach((s) => {
      formData.append('requiredSpecialties[]', s);
    });
  }

  if (data.images) {
    data.images.added.forEach((img) => {
      formData.append('images', img.file);
    });

    data.images.existing.forEach((img) => {
      formData.append('keepImageIds[]', img.id);
    });
  }

  return formData;
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
