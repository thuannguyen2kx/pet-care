import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useUpdatePet } from '@/features/pets/api/update-pet';
import {
  updatePetAllergiesInputSchema,
  type TUpdatePetAllergiesInput,
} from '@/features/pets/schemas';

type Props = {
  allergies: string[];
  petId: string;
  onSuccess?: () => void;
};
export const useUpdatePetAllergyForm = ({ allergies, petId, onSuccess }: Props) => {
  const form = useForm<TUpdatePetAllergiesInput>({
    mode: 'onChange',
    resolver: zodResolver(updatePetAllergiesInputSchema),
    defaultValues: {
      allergies: allergies.map((a) => ({ value: a })),
    },
  });

  const updatePet = useUpdatePet({
    petId,
    mutationConfig: {
      onSuccess: () => {
        onSuccess?.();
      },
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    const payload = data.allergies?.map((a) => a.value) || [];
    updatePet.mutate({ petId, data: { allergies: payload } });
  });

  useEffect(() => {
    form.reset({
      allergies: allergies.map((a) => ({ value: a })),
    });
  }, [allergies, form]);

  return {
    form,
    submit: onSubmit,
    isSubmitting: updatePet.isPending,
  };
};
