import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type Resolver } from 'react-hook-form';
import { toast } from 'sonner';

import { useCreatePet } from '@/features/pets/api/create-pet';
import { PET_GENDERS, PET_TYPES } from '@/features/pets/domain/pet.entity';
import {
  CreatePetSchema,
  CreatePetStepSchemas,
  type CreatePet,
} from '@/features/pets/domain/pet.state';

export const useCreatePetForm = ({ onSuccess }: { onSuccess?: () => void } = {}) => {
  const form = useForm<CreatePet>({
    resolver: zodResolver(CreatePetSchema) as Resolver<CreatePet>,
    mode: 'onChange',
    defaultValues: {
      name: '',
      type: PET_TYPES.DOG,
      breed: '',
      gender: PET_GENDERS.MALE,
      dateOfBirth: null,
      weight: 0,
      color: '',
      microchipId: '',
      isNeutered: false,
      allergies: [],
      medicalNotes: '',
      petImage: undefined,
    },
  });

  const createPetMutation = useCreatePet({
    mutationConfig: {
      onSuccess: () => {
        toast.success('Thêm thú cưng thành công');
        form.reset();
        onSuccess?.();
      },
    },
  });

  const validateStep = (step: keyof typeof CreatePetStepSchemas): boolean => {
    const values = form.getValues();
    const result = CreatePetStepSchemas[step].safeParse(values);

    if (result.success) return true;

    form.clearErrors();

    result.error.issues.forEach((issue) => {
      const fieldName = issue.path[0] as keyof CreatePet;

      form.setError(fieldName, {
        type: 'manual',
        message: issue.message,
      });
    });

    return false;
  };

  const submit = form.handleSubmit((data) => {
    createPetMutation.mutate(data);
  });

  return {
    form,

    validateStep,
    submit,

    isSubmitting: createPetMutation.isPending,
    isSuccess: createPetMutation.isSuccess,
    error: createPetMutation.error,
  };
};
