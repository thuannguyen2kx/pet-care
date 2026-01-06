import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type Resolver } from 'react-hook-form';

import { createServiceSchema, type TCreateServiceInput } from '@/features/service/schemas';

export const useCreateServiceForm = () => {
  const form = useForm<TCreateServiceInput>({
    resolver: zodResolver(createServiceSchema) as Resolver<TCreateServiceInput>,
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
