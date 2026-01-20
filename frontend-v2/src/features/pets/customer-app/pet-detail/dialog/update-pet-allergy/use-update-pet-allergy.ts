import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useUpdatePet } from '@/features/pets/api/update-pet';
import {
  UpdatePetAllergiesSchema,
  type UpdatePetAllergies,
} from '@/features/pets/domain/pet.state';

type Props = {
  allergies: string[];
  petId: string;
  onSuccess?: () => void;
};
export const useUpdatePetAllergyForm = ({ allergies, petId, onSuccess }: Props) => {
  const form = useForm<UpdatePetAllergies>({
    mode: 'onChange',
    resolver: zodResolver(UpdatePetAllergiesSchema),
    defaultValues: {
      petId,
      allergies: allergies.map((a) => ({ value: a })),
    },
  });

  const updatePet = useUpdatePet({
    mutationConfig: {
      onSuccess: () => {
        onSuccess?.();
      },
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    updatePet.mutate({ ...data, kind: 'allergies' });
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
