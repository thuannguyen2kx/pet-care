import type { TUpdateServiceInput } from '@/features/service/schemas';

export const mapUpdateServiceFormToApiPayload = (data: TUpdateServiceInput): FormData => {
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
