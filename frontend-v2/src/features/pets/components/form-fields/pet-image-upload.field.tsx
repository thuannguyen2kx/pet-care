// fields/pet-image-upload.field.tsx
import { useFormContext, Controller } from 'react-hook-form';

import { PetImageUpload } from '@/features/pets/components/pet-image-upload/pet-image-upload';
import type { TUpdatePetImageInput } from '@/features/pets/schemas';
import { Field, FieldError } from '@/shared/ui/field';

export function PetImageUploadField({ initialUrl }: { initialUrl?: string }) {
  const { control } = useFormContext<TUpdatePetImageInput>();

  return (
    <Controller
      name="petImage"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <PetImageUpload initialUrl={initialUrl} value={field.value} onChange={field.onChange} />
          {fieldState.error && <FieldError className="text-center" errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
