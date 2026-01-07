import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import type { TService } from '@/features/service/domain/service.entity';
import { updateServiceSchema, type TUpdateServiceInput } from '@/features/service/schemas';

export function useUpdateServiceForm(service: TService) {
  const form = useForm<TUpdateServiceInput>({
    resolver: zodResolver(updateServiceSchema),
    defaultValues: {
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      category: service.category,
      requiredSpecialties: service.requiredSpecialties ?? [],
      images: {
        existing:
          service.images.map((img) => ({
            id: img.publicId,
            url: img.url,
          })) || [],
        added: [],
      },
      isActive: service.isActive,
    },
  });

  return { form };
}
