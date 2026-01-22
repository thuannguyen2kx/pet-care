import { Controller, useFormContext } from 'react-hook-form';

import type { UpdatePetInfo } from '@/features/pets/domain/pet.state';
import { Field, FieldError, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';

export function PetNameField() {
  const { control } = useFormContext<UpdatePetInfo>();
  return (
    <Controller
      control={control}
      name="name"
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>Tên thú cưng</FieldLabel>
          <Input
            id={field.name}
            placeholder="VD: Mini, Lucky, Coco..."
            {...field}
            aria-invalid={fieldState.invalid}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
