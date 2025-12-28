import { Controller, useFormContext } from 'react-hook-form';

import type { TUpdatePetInfoInput } from '@/features/pets/schemas';
import { PickerWithInput } from '@/shared/components/picker-with-input';
import { Field, FieldError, FieldLabel } from '@/shared/ui/field';

export function PetBirthDateField() {
  const { control } = useFormContext<TUpdatePetInfoInput>();
  return (
    <Controller
      name="dateOfBirth"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>Ngày sinh</FieldLabel>
          <PickerWithInput value={field.value ?? undefined} onChange={field.onChange} />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
