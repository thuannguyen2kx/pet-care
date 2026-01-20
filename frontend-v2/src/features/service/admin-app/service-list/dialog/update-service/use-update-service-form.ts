import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { UpdateServiceSchema, type UpdateService } from '@/features/service/domain/serivice.state';
import type { Service } from '@/features/service/domain/service.entity';

export function useUpdateServiceForm(service: Service) {
  const form = useForm<UpdateService>({
    resolver: zodResolver(UpdateServiceSchema),
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
