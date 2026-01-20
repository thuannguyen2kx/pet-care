import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm, type Resolver } from 'react-hook-form';

import { useUpdatePet } from '@/features/pets/api/update-pet';
import type { Pet } from '@/features/pets/domain/pet.entity';
import { UpdatePetInfoSchema, type UpdatePetInfo } from '@/features/pets/domain/pet.state';

function mapPetInfoToFormValues(pet: Pet): UpdatePetInfo {
  return {
    petId: pet.id,
    name: pet.name,
    type: pet.type,
    breed: pet.breed,
    gender: pet.gender,
    dateOfBirth: pet.dateOfBirth ? new Date(pet.dateOfBirth) : undefined,
    weight: pet.weight != null ? pet.weight : undefined,
    color: pet.color,
    microchipId: pet.microchipId,
    isNeutered: pet.isNeutered,
  };
}

export const useUpdatePetInfoForm = ({
  pet,
  onSucess,
}: {
  petId: string;
  pet: Pet;
  onSucess?: () => void;
}) => {
  const form = useForm<UpdatePetInfo>({
    defaultValues: mapPetInfoToFormValues(pet),
    resolver: zodResolver(UpdatePetInfoSchema) as Resolver<UpdatePetInfo>,
  });
  const updatePet = useUpdatePet({
    mutationConfig: {
      onSuccess: () => {
        onSucess?.();
      },
    },
  });

  const submit = form.handleSubmit((data) => {
    updatePet.mutate(
      { ...data, kind: 'info' },
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
