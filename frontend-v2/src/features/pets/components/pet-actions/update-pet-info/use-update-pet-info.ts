import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useUpdatePet } from '@/features/pets/api/update-pet';
import { mapPetInfoToFormValues } from '@/features/pets/mappers';
import { updatePetInfoInputSchema, type TUpdatePetInfoInput } from '@/features/pets/schemas';
import type { TPet } from '@/features/pets/types';
import { removeUndefined } from '@/shared/lib/utils';

export const useUpdatePetInfoForm = ({
  petId,
  pet,
  onSucess,
}: {
  petId: string;
  pet: TPet;
  onSucess?: () => void;
}) => {
  const form = useForm<TUpdatePetInfoInput>({
    defaultValues: mapPetInfoToFormValues(pet),
    resolver: zodResolver(updatePetInfoInputSchema),
  });
  const updatePet = useUpdatePet({
    petId,
    mutationConfig: {
      onSuccess: () => {
        onSucess?.();
      },
    },
  });

  const submit = form.handleSubmit((data) => {
    const cleanedData = removeUndefined(data);
    updatePet.mutate(
      { petId, data: cleanedData },
      {
        onSuccess() {},
      },
    );
  });

  useEffect(() => {
    form.reset(mapPetInfoToFormValues(pet));
  }, [pet, form]);

  return { form, submit, isSubmitting: updatePet.isPending };
};
