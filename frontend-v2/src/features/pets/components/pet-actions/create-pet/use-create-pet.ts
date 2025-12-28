import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useCreatePet } from '@/features/pets/api/create-pet';
import {
  createPetInputSchema,
  stepSchemas,
  type TCreatePetFormStep,
  type TCreatePetInput,
} from '@/features/pets/schemas';

export const useCreatePetForm = ({ onSuccess }: { onSuccess?: () => void } = {}) => {
  const form = useForm<TCreatePetInput>({
    resolver: zodResolver(createPetInputSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      type: 'dog',
      breed: '',
      gender: 'male',
      dateOfBirth: null,
      weight: '',
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

  const validateStep = (step: TCreatePetFormStep): boolean => {
    const values = form.getValues();
    const result = stepSchemas[step].safeParse(values);

    if (result.success) return true;

    form.clearErrors();

    result.error.issues.forEach((issue) => {
      const fieldName = issue.path[0] as keyof TCreatePetInput;

      form.setError(fieldName, {
        type: 'manual',
        message: issue.message,
      });
    });

    return false;
  };

  const submit = form.handleSubmit((data) => {
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('type', data.type);
    formData.append('breed', data.breed);
    formData.append('gender', data.gender);
    formData.append('weight', data.weight);
    formData.append('color', data.color);

    if (data.microchipId) {
      formData.append('microchipId', data.microchipId);
    }

    formData.append('isNeutered', String(data.isNeutered));

    if (data.dateOfBirth) {
      formData.append('dateOfBirth', data.dateOfBirth.toISOString());
    }

    if (data.petImage) {
      formData.append('petImage', data.petImage);
    }
    if (data.allergies) {
      formData.append('allergies', JSON.stringify(data.allergies.map((a) => a.value)));
    }

    if (data.medicalNotes) {
      formData.append('medicalNotes', data.medicalNotes);
    }

    createPetMutation.mutate({ data: formData });
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
