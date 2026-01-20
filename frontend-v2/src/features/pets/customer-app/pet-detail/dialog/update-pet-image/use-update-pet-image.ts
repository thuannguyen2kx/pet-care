import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useUpdatePetImage } from '@/features/pets/api/update-pet-image';
import { UpdatePetImageSchema, type UpdatePetImage } from '@/features/pets/domain/pet.state';

export function useUpdatePetImageForm({
  petId,
  onSuccess,
}: {
  petId: string;
  onSuccess?: () => void;
}) {
  const mutation = useUpdatePetImage({
    petId,
    mutationConfig: { onSuccess },
  });

  const form = useForm<UpdatePetImage>({
    mode: 'onChange',
    resolver: zodResolver(UpdatePetImageSchema),
    defaultValues: { petImage: undefined },
  });

  const submit = form.handleSubmit((data) => {
    if (!data.petImage) return;

    const fd = new FormData();
    fd.append('petImage', data.petImage);

    mutation.mutate({ petId, data: fd });
  });

  return { form, submit, isSubmitting: mutation.isPending };
}
