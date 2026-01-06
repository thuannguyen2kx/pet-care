import type { TCreateServiceInput } from '@/features/service/schemas';

export const mapCreateServiceFormToApiPayload = (data: TCreateServiceInput): FormData => {
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
