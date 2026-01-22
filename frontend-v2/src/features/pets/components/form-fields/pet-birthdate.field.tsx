import { Controller, useFormContext } from 'react-hook-form';

import type { UpdatePetInfo } from '@/features/pets/domain/pet.state';
import { PickerWithInput } from '@/shared/components/picker-with-input';
import { Field, FieldError, FieldLabel } from '@/shared/ui/field';

export function PetBirthDateField() {
  const { control } = useFormContext<UpdatePetInfo>();
  return (
    <Controller
      name="dateOfBirth"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>Ngày sinh</FieldLabel>
          <PickerWithInput
            value={field.value ?? undefined}
            onChange={field.onChange}
            disabledDate={(date) => date > new Date()}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
