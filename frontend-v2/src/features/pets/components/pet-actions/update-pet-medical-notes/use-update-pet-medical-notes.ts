import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useUpdatePet } from '@/features/pets/api/update-pet';
import {
  updatePetMedicalNotesInputSchema,
  type TUpdatePetMedicalNotesInput,
} from '@/features/pets/schemas';

export const useUpdatePetMedicalNotesForm = ({
  petId,
  medicalNotes,
  onSuccess,
}: {
  petId: string;
  medicalNotes?: string;
  onSuccess?: () => void;
}) => {
  const form = useForm<TUpdatePetMedicalNotesInput>({
    mode: 'onChange',
    resolver: zodResolver(updatePetMedicalNotesInputSchema),
    defaultValues: {
      medicalNotes,
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

  const onSubmit = form.handleSubmit((data: TUpdatePetMedicalNotesInput) => {
    updatePet.mutate({ petId, data });
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
