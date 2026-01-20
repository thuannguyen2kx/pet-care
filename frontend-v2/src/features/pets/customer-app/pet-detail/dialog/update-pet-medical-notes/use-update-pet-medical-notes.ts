import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useUpdatePet } from '@/features/pets/api/update-pet';
import {
  UpdatePetMedicalNotesSchema,
  type UpdatePetMedicalNotes,
} from '@/features/pets/domain/pet.state';

export const useUpdatePetMedicalNotesForm = ({
  petId,
  medicalNotes,
  onSuccess,
}: {
  petId: string;
  medicalNotes?: string;
  onSuccess?: () => void;
}) => {
  const form = useForm<UpdatePetMedicalNotes>({
    mode: 'onChange',
    resolver: zodResolver(UpdatePetMedicalNotesSchema),
    defaultValues: {
      petId,
      medicalNotes,
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
    updatePet.mutate({ ...data, kind: 'medicalNotes' });
  });

  useEffect(() => {
    form.reset({
      medicalNotes: medicalNotes,
    });
  }, [form, medicalNotes]);

  return {
    form,
    submit: onSubmit,
    isSubmitting: updatePet.isPending,
  };
};
