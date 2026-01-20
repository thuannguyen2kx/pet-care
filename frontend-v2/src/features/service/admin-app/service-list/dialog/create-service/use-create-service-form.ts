import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type Resolver } from 'react-hook-form';

import { CreateServiceSchema, type CreateService } from '@/features/service/domain/serivice.state';

export const useCreateServiceForm = () => {
  const form = useForm<CreateService>({
    resolver: zodResolver(CreateServiceSchema) as Resolver<CreateService>,
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      duration: 0,
      category: undefined,
      requiredSpecialties: [],
      images: {
        existing: [],
        added: [],
      },
    },
  });

  return { form };
};
