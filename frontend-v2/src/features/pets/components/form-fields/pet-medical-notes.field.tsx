import { Controller, useFormContext } from 'react-hook-form';

import type { TUpdatePetMedicalNotesInput } from '@/features/pets/schemas';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { Textarea } from '@/shared/ui/textarea';

export function PetMedicalNotesField() {
  const { control } = useFormContext<TUpdatePetMedicalNotesInput>();
  return (
    <FieldGroup>
      <Controller
        name="medicalNotes"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Ghi chú sức khoẻ</FieldLabel>
            <Textarea
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="Cần kiểm tra răng định kỳ, hay bị viêm tai..."
              {...field}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </FieldGroup>
  );
}
